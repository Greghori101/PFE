<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'summary',
        'keywords',
        'archived_at',
        'file',
    ];

    function tools()
    {
        return $this->belongsToMany(Tool::class);
    }

    function level()
    {
        return $this->belongsTo(Level::class);
    }

    function author(){
        return $this->belongsTo(User::class);
    }
    function groups(){
        return $this->hasMany(Group::class);
    }
    
}
