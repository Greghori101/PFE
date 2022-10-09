<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    protected $fillable = ['grade','is_supervisor',];

    function user(){
        return $this->belongsTo(User::class);
    }
    function supervisor(){
        return $this->hasOne(Supervisor::class);
    }
}
