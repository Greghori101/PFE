<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;
    protected $fillable=[
        'state',
        'from'
    ];
    function members(){
        return $this->hasMany(Student::class);
    }

    function project(){
        return $this->belongsTo(Project::class);
    }

    function archive(){
        return $this->belongsTo(Archive::class);
    }

    function supervisor(){
        return $this->belongsTo(Supervisor::class);
    }
}
