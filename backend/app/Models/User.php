<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
 
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'gender',
        'role',
        'birthday',
        'birthplace',
        'profile_picture',
        'phone',
        'address',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    function admin(){
        return $this->hasOne(Admin::class);
    }
    function projects(){
        return $this->hasMany(Project::class);
    }

    function archives(){
        return $this->hasMany(Archive::class);
    }
    function teacher(){
        return $this->hasOne(Teacher::class);
    }
    function student(){
        return $this->hasOne(Student::class);
    }
    function company(){
        return $this->hasOne(Company::class);
    }
    function received_notifications(){
        return $this->hasMany(Notification::class,'from');
    }
    function sent_notifications(){
        return $this->hasMany(Notification::class,'to');
    }
}
