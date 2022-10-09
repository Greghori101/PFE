<?php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\{Student, Group, Project, User, Level, Notification, Supervisor, Teacher};
use DB;
use Illuminate\Support\Facades\Redis;

class GroupController extends Controller
{
    public function index($id = null)
    {
        if (!$id) {
            $list = Group::all();
            $groups = [];
            foreach ($list as $group) {

                if ($group->supervisor != null) {
                    $group['supervisor'] = $group->supervisor->teacher->user;
                }
                if ($group->project) {
                    $project = Project::find($group->project->id);
                    $project['keywords'] = explode('§', $project['keywords']);
                    $user = User::find($project['user_id']);
                    $project['author'] = $user;
                    $level = Level::find($project->level_id);
                    $user = User::find($project->user_id);
                    $group['level'] = $level;
                    $group["author"] = $user;
                    $group["project"] = $project;
                }

                $group["members"] = $group->members;
                foreach ($group->members as $key => $value) {
                    $value["user"] = $value->user;
                    if ($value->is_chef) {
                        $group["leader"] = $value;
                    }
                }
                array_push(
                    $groups,
                    $group
                );
            }
        } else {
            $groups = Group::where('id', $id);
            if ($groups->supervisor) {
                $groups['supervisor'] = $groups->supervisor->teacher->user;
            }

            $project = Project::find($groups->project->id);
            $project['keywords'] = explode('§', $project['keywords']);
            $user = User::find($project['user_id']);
            $project['author'] = $user;
            $project['level'] = Level::find($project->level_id);
            $groups["project"] = $project;
            $groups["members"] = $groups->members;
            foreach ($groups->members as $key => $value) {
                $value["user"] = $value->user;
                if ($value->is_chef) {
                    $groups["leader"] = $value;
                }
            }
        }
        return $groups;
    }
    public function noneCompleted()
    {
        $list = Group::where("state","approved")->get();
        $groups = [];
        foreach ($list as $group) {

            if ($group->supervisor != null) {
                $group['supervisor'] = $group->supervisor->teacher->user;
            }

            $group["members"] = $group->members;
            foreach ($group->members as $key => $value) {
                $value["user"] = $value->user;
                if ($value->is_chef) {
                    $group["leader"] = $value;
                }
            }
            if ($group->members()->count() < 6) {
                array_push(
                    $groups,
                    $group
                );
            }
        }


        return $groups;
    }
    public function create(Request $request)
    {
        $group = Group::create();
        $student = Student::find($request->student_id);
        $group->members()->save($student);
        $supervisor = Supervisor::find($request->supervisor_id);
        $supervisor->groups()->save($group);
        $project = Project::find($request->project_id);
        $project->groups()->save($group);
        $student->is_chef = true;
        $student->in_group = true;
        $supervisor->save();
        $group->save();
        $student->save();
        return response(200);
    }
    public function edit(Request $request, $id)
    {
        $group = Group::find($id);
        foreach ($group->members as $key => $value) {
            $value["user"] = $value->user;
            if ($value->is_chef) {
                $student = Student::find($value->id);
                $student->is_chef = false;
                $student->save();
            }
        }
        $project = Project::find($request->project_id);
        $supervisor = Supervisor::find($request->supervisor_id);
        $student = Student::find($request->teamLeaderId);
        if ($student){

        $student->is_chef = true;
        $student->in_group = true;
        $student->save();
        }
        if($project){

        $project->groups()->save($group);
        }
        if($supervisor){

        $supervisor->groups()->save($group);
        }
        return response(200);
    }
    public function selectLeader($id)
    {
        $student = Student::find($id);
        $student->is_chef = true;
        $student->in_group = true;
        $group = Group::create();
        $group->members()->save($student);
        $student->save();
    }
    public function selectSupervisor($id)
    {
        $teacher = Teacher::find(User::find($id)->teacher->id);
        $supervisor = Supervisor::create();
        $teacher->supervisor()->save($supervisor);
        $teacher->is_supervisor = true;
        $teacher->save();
    }
    public function deselectLeader($id)
    {
        $student = Student::find($id);
        $group = Group::find($student->group->id);
        $student->save();
        if ($group->members()->count() < 1) {

        $student->group_id = null;
            $group->delete();
        }
        $student->is_chef = false;
        $student->in_group = false;
        $student->save();
        return response(200);
    }
    public function deselectSupervisor($id)
    {
        $teacher = Teacher::find(User::find($id)->teacher->id);
        $teacher->is_supervisor = false;
        $supervisor = Supervisor::where('teacher_id', $teacher->id)->first();
        $supervisor->groups()->delete();
        $teacher->supervisor()->delete();
        $teacher->save();
    }
    public function notSelectedStudents()
    {
        $students = Student::where("in_group", false)->get();
        $list = [];
        foreach ($students as $student) {
            $student['user'] =  $student->user;
            $student['level'] =  $student->level;
            array_push($list, $student);
        }
        return $list;
    }

    public function selectProject($id)
    {
        $user = Auth::user();
        $group = Group::find($user->student->group->id);
        $project = Project::find($id);
        // $items = array(1, 2, 3, 4, 5);
        // echo $items[array_rand($items)];
        $project->selected = true;
        $project->groups()->save($group);
        $group->save();
        return response(200);
    }
    public function addMember(Request $request)
    {
        $group = Group::find($request->group_id);
        $user = User::find($request->member_id);
        $student = Student::find($user->student->id);
        $student->in_group = true;
        $group->members()->save($student);
        $student->save();
        $group->save();
        return response(200);
    } public function deleteMember($id)
    {
        $student = Student::find($id);
        $student->group_id=null;
        $student->is_chef = false;
        $student->in_group = false;
        $student->save();
        return response(200);
    }
    public function approve(Request $request, $id)
    {
        $group = Group::find($id);
        $group->state = "approved";
        $group->save();
        return response(200);
    }
    public function form(Request $request, $id)
    {
        $group = Group::find($id);
        $p = explode('§', $group['form']);
        $projects = [];
        $i =0;
        foreach ($p as $key => $value) {
            $i++;
            if($value!=""){
                $project = Project::find(intval($value));
                $project["p_id"] = $i;
array_push($projects,$project);
            }
        }

        return $projects;
    }public function fill(Request $request)
    {
        $group = Group::find($request->group_id);
        $group->form =  implode('§', $request->projects);
        $group->save();
        return response(200);
    }public function reject(Request $request, $id)
    {
        $group = Group::find($id);
        $group->state = "rejected";
        $group->save();
        return response(200);
    }

    public function grading(Request $request, $id)
    {
        $group = Group::find($id);
        foreach ($group->members as $member) {
            $student = Student::find($member->id);
            $student->mark = $request->mark;
            $student->save();
        }
        return response(200);
    }

    public function delete($id)
    {

        $group = Group::find($id);
        foreach ($group->members as $key => $value) {
            $student = Student::find($value->id);
            $student->is_chef = false;
            $student->in_group = false;
            $student->save();
        }
        DB::delete('DELETE from groups WHERE id = ?', [$id]);

        return response(200);
    }
    public function mine($id)
    {
        $user = User::find($id);
        if ($user->role == "student") {
            $student = Student::find($user->student->id);
            $group = $student->group;
            if ($group) {
                if ($group->supervisor) {
                    $group['supervisor'] = $group->supervisor->teacher->user;
                } else {
                    $group['supervisor'] = "none";
                }
                if ($group->project) {

                    $project = Project::find($group->project->id);
                    $project['keywords'] = explode('§', $project['keywords']);
                    $user = User::find($project['user_id']);
                    $project['author'] = $user;
                    $project['level'] = Level::find($project->level_id);
                    $group["project"] = $project;
                }
                $group["members"] = $group->members;
                foreach ($group->members as $key => $value) {
                    $value["user"] = $value->user;
                    if ($value->is_chef) {
                        $group["leader"] = $value;
                    }
                }

                return $group;
            } else {
                return "none";
            }
        } else if($user->role == "teacher"){
            $list = $user->teacher->supervisor->groups;
            $groups = [];
            foreach ($list as $group) {
    
                if ($group->supervisor != null) {
                    $group['supervisor'] = $group->supervisor->teacher->user;
                }
                if ($group->project) {

                    $project = Project::find($group->project->id);
                    $project['keywords'] = explode('§', $project['keywords']);
                    $user = User::find($project['user_id']);
                    $project['author'] = $user;
                    $project['level'] = Level::find($project->level_id);
                    $group["project"] = $project;
                }
                $group["members"] = $group->members;
                foreach ($group->members as $key => $value) {
                    $value["user"] = $value->user;
                    if ($value->is_chef) {
                        $group["leader"] = $value;
                    }
                }
                if ($group->members()->count() < 6) {
                    array_push(
                        $groups,
                        $group
                    );
                }
            }
            return $groups;

        }else{
            abort(401);
        }
    }
}
