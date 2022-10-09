<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;

use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//Public routes
Route::post('login', [AuthController::class, 'signin']);
Route::post('forgotpassword', [AuthController::class, 'forgotpassword']);

//Create user Admin
// Route::post('register', [AuthController::class, 'signup']);
// Route::put('users/changepassword/', [AuthController::class, 'change_password']);

//Protected routes
Route::middleware('auth:sanctum')->group(function () {

    //Route::resource('blogs', BlogController::class); test api

    // AuthControler routes
    Route::get('logout', [AuthController::class, 'logout']);
    Route::delete('users/delete/{id}', [AuthController::class, 'deleteUser']);
    Route::delete('users/archive/{id}', [AuthController::class, 'archiveUser']);
    Route::get('users/{id?}', [AuthController::class, 'users']);
    Route::get('archivedusers', [AuthController::class, 'archive']);
    Route::post('users/edit/{id}', [AuthController::class, 'editUserInfo']);
    Route::put('edit/profile/', [AuthController::class, 'change_password']);
    //create normal user
    Route::post('register', [AuthController::class, 'signup']);
  
    //
    Route::get('students/{id?}', [AuthController::class, 'students']);
    Route::get('allstudents/', [AuthController::class, 'all_students']);
    Route::get('teachers/{id?}', [AuthController::class, 'teachers']);
    Route::get('companies/{id?}', [AuthController::class, 'companies']);
    Route::post('users/profile_picture/edit', [AuthController::class, 'edit_profile_picture']);
    Route::get('supervisors/{id?}', [AuthController::class, 'supervisors']);
    Route::get('leaders/', [AuthController::class, 'leaders']);

    //Settings routes
    Route::post('levels/add', [SettingsController::class, 'addLevel']);
    Route::get('levels/{id?}', [SettingsController::class, 'levels']);
    Route::delete('levels/delete/{id}', [SettingsController::class, 'deleteLevel']);
    Route::put('levels/edit/{id}', [SettingsController::class, 'editLevel']);

    //Project routes
    Route::get('projects/{id?}', [ProjectController::class, 'projects']);
    Route::get('archives/{id?}', [ProjectController::class, 'archives']);
    Route::post('projects/add', [ProjectController::class, 'add']);
    Route::post('projects/select/{id}', [GroupController::class, 'selectProject']);
    Route::get('projects/mine/{id?}', [ProjectController::class, 'mine']);
    Route::post('search', [ProjectController::class, 'search']);
    Route::delete('projects/archive/{id?}', [ProjectController::class, 'archive']);
    Route::get('all', [ProjectController::class, 'all']);
    Route::put('projects/approve/{id}', [ProjectController::class, 'approve']);
    Route::post('projects/edit/{id}', [ProjectController::class, 'edit']);
    Route::put('projects/reject/{id}', [ProjectController::class, 'reject']);
    Route::delete('projects/delete/{id}', [ProjectController::class, 'delete']);

    //statistics
    Route::get('statistics', [AuthController::class, 'statistics']);

    //Notification routes
    Route::post('notifications/send', [NotificationController::class, 'send']);
    Route::put('notifications/seen/{id?}', [NotificationController::class, 'seen']);
    Route::get('all/notifications', [NotificationController::class, 'all']);
    Route::get('notifications/{id?}', [NotificationController::class, 'notifications']);
    Route::delete('notifications/delete/{id?}', [NotificationController::class, 'delete']);

    //GroupController routes
    Route::get('/groups/{id?}', [GroupController::class, 'index']);
    Route::post('/groups/create/', [GroupController::class, 'create']);
    Route::post('/fill/form/', [GroupController::class, 'fill']);
    Route::get('/form/{id}', [GroupController::class, 'form']);
    Route::put('/groups/select_leader/{id}', [GroupController::class, 'selectLeader']);
    Route::put('/groups/select_supervisor/{id}', [GroupController::class, 'selectSupervisor']);
    Route::put('/groups/edit/{id}', [GroupController::class, 'edit']);
    Route::delete('/groups/deselect_leader/{id}', [GroupController::class, 'deselectLeader']);
    Route::delete('/groups/deselect_supervisor/{id}', [GroupController::class, 'deselectSupervisor']);
    Route::post('/groups/members/add/', [GroupController::class, 'addMember']);
    Route::delete('/groups/members/delete/{id}', [GroupController::class, 'deleteMember']);
    Route::delete('/groups/delete/{id}', [GroupController::class, 'delete']);
    Route::put('/groups/approve/{id}', [GroupController::class, 'approve']);
    Route::put('/groups/reject/{id}', [GroupController::class, 'reject']);
    Route::get('/rest_students/', [GroupController::class, 'notSelectedStudents']);
    Route::get('/groups/mine/{id?}', [GroupController::class, 'mine']);
    Route::get('/nonecompleted', [GroupController::class, 'noneCompleted']);
});
