<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supervisor extends Model
{
    use HasFactory;

    function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    function project()
    {
        return $this->belongsTo(Project::class);
    }
    function groups()
    {
        return $this->hasMany(Group::class);
    }
}
