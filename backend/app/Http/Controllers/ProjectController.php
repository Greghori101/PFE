<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Student;
use App\Models\Archive;
use App\Models\Supervisor;

class ProjectController extends Controller
{

    public function add(Request $request)
    {


        $file = $request->file('file');
        $filename = $request->input('title') . '.' . $file->getClientOriginalExtension();
        $file->move('files/', $filename);

        $project = Project::create([
            'title' => $request['title'],
            'summary' => $request['summary'],
            'description' => $request['description'],
            'file' => $filename,
            'keywords' => implode('§', $request->input('keywords')),
        ]);
        $user = User::find(Auth::id());
        $level = Level::find($request->level);
        $user->projects()->save($project);
        $level->projects()->save($project);
        // if ($user->role === "teacher") {
        //     $super = $user->teacher->supervisor;
        //     $project->supervisors()->save($super);
        // }
        // foreach ($request->supervisors as $id) {
        //     $super = Supervisor::find($id);
        //     $project->supervisors()->save($super);
        // }
        $project->save();
        return $user;
    }



    public function projects($id = null)
    {

        if (!$id) {
            $projects = Project::where('state', 'approved')->get();
            foreach ($projects as $project) {
                $project['keywords'] = explode('§', $project['keywords']);
                $user = User::find($project['user_id']);
                $project['author'] = $user;
                $project['level'] = Level::find($project->level_id);
            }
        } else {
            $projects = Project::find($id);
            if ($projects !== null) {
                $projects['keywords'] = explode('§', $projects['keywords']);
                $user = User::find($projects['user_id']);
                $projects['author'] = $user;
                $projects['level'] = Level::find($projects->level_id);
                return $projects;
            } else {
                abort(404);
            }
        }
        return $projects;
    }
    public function search(Request $request)
    {
 $projects = Project::where("title",'like','%'.$request->search_input.'%')->get();
            foreach ($projects as $project) {
                $project['keywords'] = explode('§', $project['keywords']);
               $user = User::find($project['user_id']);
               $project['author'] = $user;
                $project['level'] = Level::find($project->level_id);
            }
        
        return $projects;
    }
    public function archives($id = null)
    {

        if (!$id) {
            $archives = Archive::all();
            foreach ($archives as $archive) {
                $archive['keywords'] = explode('§', $archive['keywords']);
                $user = User::find($archive['user_id']);
                $archive['author'] = $user;
                $archive['level'] = Level::find($archive->level_id);
            }
        } else {
            $archives = Archive::find($id)->first();
            if ($archives !== null) {
                $archives['keywords'] = explode('§', $archives['keywords']);
                $user = User::find($archives['user_id']);
                $archives['author'] = $user;
                $archives['level'] = Level::find($archives->level_id);
                return $archives;
            } else {
                abort(404);
            }
        }
        return $archives;
    }
    public function all()
    {

        $projects = Project::all();
        foreach ($projects as $project) {
            $project['keywords'] = explode('§', $project['keywords']);
            $user = User::find($project['user_id']);
            $project['author'] = $user;
            $project['level'] = Level::find($project->level_id);
        }
        return $projects;
    }
    public function mine($id)
    {
        $user = User::find($id);
        if ($user->role == "teacher" || $user->role == "company") {
            $projects = Project::where('user_id', $user->id)->get(); //$user->projects();
            if ($projects !== null) {
                foreach ($projects as $project) {
                    $project->keywords = explode('§', $project->keywords);

                    $user = User::find($project['user_id']);
                    $project['author'] = $user;
                    $project['level'] = Level::find($project->level_id);
                }
                return $projects;
            } else {
                abort(404);
            }
        } else if ($user->role == "student") {

            $student = Student::find($user->student->id);
            $group = $student->group;
            if ($group && $group->project) {
                $project = Project::find($group->project->id);
                $project->keywords = explode('§', $project->keywords);
                $user = User::find($project->user_id);
                $project['author'] = $user;
                $project['level'] = Level::find($project->level_id);
                return $project;
            } else {
                return "none";
            }
        } else {
            abort(401);
        }
    }
    public function approve($id)
    {
        $project = Project::where('id', $id)->update(['state' => 'approved']);
        return response(200);
    }
    public function reject($id)
    {
        $project = Project::where('id', $id)->update(['state' => 'rejected']);
        return response(200);
    }
    public function delete($id)
    {
        $project = Project::find($id);
        foreach ($project->groups as $key => $value) {
            $value->project_id = null;
            $value->save();
        }
        $project->delete();
        return response(200);
    }
    public function edit(Request  $request, $id)
    {
        if (!$id) {
            abort(404);
        }
        $project = Project::find($id);
        if (!$project) {
            abort(404);
        }
        $file = $request->file('file');
if($file){

        File::delete('files/' . $project->file);
        $filename = $request->input('title') . '.' . $file->getClientOriginalExtension();
        $file->move('files/', $filename);$project->file = $filename;
}
        $project->title = $request->input('title');
        $project->summary = $request->input('summary');
        $project->description = $request->input('description'); 
        $project->keywords = implode('§', $request->input('keywords'));
        $project->level_id = $request->input('level');
        $project->state = 'pendding approval';
        $project->save();
        return $project->user;
    }
    public function archive($id)
    {
        $project = Project::find($id);
        $archive = Archive::create([
            'title' => $project->title,
            'summary' => $project->summary,
            'description' => $project->description,
            'file' => $project->file,
            'keywords' => $project->keywords,
        ]);
        $user = User::find($project['user_id']);
        if($project->level){

        $level = Level::find($project->level->id);
        $level->archives()->save($project);
        }
        $user->archives()->save($archive);
        $archive->save(); foreach ($project->groups as $key => $value) {
            $value->project_id = null;
            $value->save();
        }
        $project->delete();
    }
}
