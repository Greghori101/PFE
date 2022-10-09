<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tool extends Model
{
    use HasFactory;
    protected $fillable =['name',];

    function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    function archives()
    {
        return $this->belongsToMany(Archive::class);
    }
}
