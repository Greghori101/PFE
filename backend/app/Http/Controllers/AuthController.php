<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\File;
use App\Mail\Email;
use Illuminate\Support\Str;
use App\Models\{User, Supervisor, Admin, ArchivedUser, Teacher, Company, Student, Project, Level, Group};

class AuthController extends Controller
{

    public function signin(Request $request)
    {
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $remember = $request->remember_me;
            Auth::login($user, $remember);
            $data['token'] =  $user->createToken($user->id)->plainTextToken;
            $data['user'] =  $user;

            return response()->json($data, 200);
        } else {
            return abort(403);
        }
    }

    public function signup(Request $request)
    {
        $input = $request->validate([
            'email' => 'required|email',
            'phone' => 'string',
            'address' => 'string',
            'role' => 'required|string',
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'birthday' => 'required|date',
            'birthplace' => 'required|string',
            'gender' => 'required|string',
        ]);


        $password = Str::random(10);
        $input['password'] = bcrypt($password);
        $user = User::create([
            'phone' => $input['phone'],
            'email' => $input['email'],
            'firstname' => $input['firstname'],
            'lastname' => $input['lastname'],
            'birthday' => $input['birthday'],
            'gender' => $input['gender'],
            'birthplace' => $input['birthplace'],
            'password' => $input['password'],
            'address' => $input['address'],
            'role' => $input['role'],
            'profilePicture' => 'default-company-profile-picture',
        ]);

        if ($user->role == 'teacher') {
            $user->teacher()->save(new Teacher);
        } else if ($user->role == 'student') {
            $user->student()->save(new Student());
            $level = Level::find($request->level);
            $level->students()->save($user->student);
        } else if ($user->role == 'admin') {
            $user->admin()->save(new Admin);
        } else {
            $user->company()->save(new Company);
        }

        try {
            Mail::to($user['email'])->send(
                new Email(
                    [
                        'title' =>  'Email Confirmatoin',
                        'body' =>  'you have been registred in our site www.teamdev.com . here is your password : ' . $password
                    ]
                )
            );
        } catch (\Throwable $th) {
            //throw $th;
            abort(400);
        }

        return response(201);
    }

    public function logout()
    {
        $user = Auth::user();
        if (Auth::check($user)) {
            //Auth::logout();
            $user->tokens()->delete();
            return response(200);
        } else {
            abort(403);
        }
    }

    public function edit_profile_picture(Request $request)
    {
        $user = User::find(Auth::user()->id);
        if ($user->profile_picture != "default_profile_picture.jpeg") {

            File::delete('files/' . $user->profile_picture);
        }
        $file = $request->file('file');
        $filename = Str::random(10) . '.' . $file->getClientOriginalExtension();
        $file->move('files/', $filename);
        $user->profile_picture = $filename;
        $user->save();
        return $user;
    }

    public function forgotpassword(Request $request)
    {
        $request->validate([
            'email' => 'required|string'
        ]);
        $user = User::where('email', $request['email'])->first();
        if (!$user) {
            abort(404);
        }
        $password = Str::random(10);
        $user->password = bcrypt($password);
        $user->save();
        try {
            //code...
            Mail::to($user['email'])->send(
                new Email(
                    [
                        'title' =>  'Password Recovery',
                        'body' =>  'your new password : ' . $password
                    ]
                )
            );
        } catch (\Throwable $th) {
            //throw $th;
            abort(400);
        }

        return response(202);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            abort(404);
        }
        if ($user->profile_picture != "default_profile_picture.jpeg") {
            File::delete('files/' . $user->profile_picture);
        }
        if ($user->role === "student") {

            if ($user->student->group) {
                $group = Group::find($user->student->group->id);
                $student = $user->student;
                if ($group->members()->count() < 2) {
                    $student->group_id = null;
                    $student->save();
                    $student->group_id = null;
                    $group->delete();
                }
            }
        }
        $user->delete();
        return response(200);
    }
    public function archiveUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            abort(404);
        }
        $archivedUser = ArchivedUser::create([
            'phone' => $user['phone'],
            'email' => $user['email'],
            'firstname' => $user['firstname'],
            'lastname' => $user['lastname'],
            'birthday' => $user['birthday'],
            'gender' => $user['gender'],
            'birthplace' => $user['birthplace'],
            'password' => $user['password'],
            'address' => $user['address'],
            'role' => $user['role'],
            'profilePicture' => $user['profile_picture'],
        ]);

        if ($user->profile_picture != "default_profile_picture.jpeg") {
            File::delete('files/' . $user->profile_picture);
        }
        if ($user->role === "student") {

            if ($user->student->group) {
                $group = Group::find($user->student->group->id);
                $student = $user->student;
                if ($group->members()->count() < 2) {

                    $student->group_id = null;
                    $group->delete();
                }
            }
        }
        $user->delete();
        return response(200);
    }
    public function change_password(Request $request)
    {
        // change password admin
        // $user = User::find(1); 
        $user = User::find(Auth::id());
        if (!$user) {
            abort(404);
        }

        $user->password = bcrypt($request->password);
        $user->phone = $request->phone;
        $user->address = $request->address;
        $user->save();
        return response(200);
    }
    public function editUserInfo(Request $request, $id)
    {
        $user = User::find($id);
        $request["password"] = $user->password;
        $request["profile_picture"] = $user->profile_picture;
        if (!$user) {
            abort(404);
        }
        if ($user->profile_picture != "default_profile_picture.jpeg") {
            File::delete('files/' . $user->profile_picture);
        }
        if ($user->role === "student") {

            if ($user->student->group) {
                $group = Group::find($user->student->group->id);
                $student = $user->student;
                if ($group->members()->count() < 2) {

                    $student->group_id = null;
                    $group->delete();
                }
            }
        }
        $user->delete();

        $user = User::create([
            'phone' => $request['phone'],
            'email' => $request['email'],
            'firstname' => $request['firstname'],
            'lastname' => $request['lastname'],
            'birthday' => $request['birthday'],
            'gender' => $request['gender'],
            'birthplace' => $request['birthplace'],
            'password' => $request['password'],
            'address' => $request['address'],
            'role' => $request['role'],
            'profilePicture' => $request['profile_picture'],
        ]);

        if ($user->role == 'teacher') {
            $user->teacher()->save(new Teacher);
        } else if ($user->role == 'student') {
            $user->student()->save(new Student());
            $level = Level::find($request->level);
            $level->students()->save($user->student);
        } else if ($user->role == 'admin') {
            $user->admin()->save(new Admin);
        } else {
            $user->company()->save(new Company);
        }

        $user->save();
        return response(200);
    }

    public function users($id = null)
    {
        if (!$id) {
            $users = User::all()->except(Auth::id());
        } else {
            $users = Auth::user(); //User::where('id', $id)->get();
        }
        return $users;
    }
    
    public function archive()
    {
            $users = ArchivedUser::all();
       
        return $users;
    }

    public function students(Request $request, $id = null)
    {
        if (!$id) {
            $list = Student::all();
            $students = [];
            foreach ($list as $student) {
                $student['group'] =  $student->group;
                $student['level'] =  $student->level;
                $student['user'] =  $student->user;
                array_push($students, $student);
            }
        } else {
            $students = Student::where('id', $id)->get()->user;
        }
        return $students;
    }
    public function teachers(Request $request, $id = null)
    {
        if (!$id) {
            $teachers = [];
            foreach (Teacher::all() as $teacher) {
                $t = $teacher->user;
                $t["is_supervisor"] = $teacher->is_supervisor;
                array_push($teachers, $t);
            }
        } else {
            $teachers = Teacher::where('id', $id)->get()->user;
        }
        return $teachers;
    }
    public function all_students()
    {
        $students = [];
        foreach (Student::all() as $student) {
            $t = $student->user;
            array_push($students, $t);
        }
        return $students;
    }
    public function supervisors($id = null)
    {
        if (!$id) {
            $supers = [];
            foreach (Supervisor::all() as $super) {
                $super["user"] = $super->teacher->user;
                array_push($supers, $super);
            }
        } else {
            $supers = Supervisor::where('id', $id)->get()->teacher()->user();
        }
        return $supers;
    }
    public function leaders()
    {
        $leaders = [];
        foreach (Student::where("is_chef", true)->get() as $student) {
            $student["user"] = $student->user;
            array_push($leaders, $student);
        }
        return $leaders;
    }
    public function companies($id = null)
    {
        if (!$id) {
            $companies = [];
            foreach (Company::all() as $company) {
                array_push($companies, $company->user);
            }
        } else {
            $companies = Company::where('id', $id)->get()->user;
        }
        return $companies;
    }


    public function statistics()
    {
        $data = [];
        $data['lc'] = Company::all()->count();;
        $data['lp'] = Project::where('state', 'approved')->count();;
        $data['lt'] = Teacher::all()->count();;
        $data['ls'] = Student::all()->count();;
        return $data;
    }
}
