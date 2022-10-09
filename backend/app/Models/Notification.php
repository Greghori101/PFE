<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'content',
        'displayed',
    ];

    function from(){
        return $this->belongsTo(User::class,'from' );
    }

    function to(){
        return $this->belongsTo(User::class,'to');
    }
}
