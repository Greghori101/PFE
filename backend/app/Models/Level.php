<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'year',
        'speciality',
        'domaine',
        'cycle'
    ];

    function projects(){
        return $this->hasMany(Project::class);
    }
    function archives(){
        return $this->hasMany(Archive::class);
    }

    function students(){
        return $this->hasMany(Student::class);
    }
}
