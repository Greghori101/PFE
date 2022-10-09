<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable=[
        'mark',
        'is_chef',
        'in_group',
    ];

    function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    function group(){
        return $this->belongsTo(Group::class);
    }

    function level(){
        return $this->belongsTo(Level::class);
    }
      


}
