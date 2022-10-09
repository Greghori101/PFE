<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::all();
        return $blogs;
    }
    
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = $request->validate([
            'title' => 'required',
            'description' => 'required'
        ]);
        $blog = Blog::create($input);
        return response()->json(200);
    }
   
    public function show($id)
    {
        $blog = Blog::find($id);
        if (is_null($blog)) {
            abort(404);
        }
        return $blog;
    }
 
    public function update(Request $request, Blog $blog)
    {
        $input = $request->all();

        $validator = $request->validate([
            'title' => 'required',
            'description' => 'required'
        ]);

        $blog->title = $input['title'];
        $blog->description = $input['description'];
        $blog->save();
        
        return response()->json(200);
        }
   
    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->json(200);
    }
}
