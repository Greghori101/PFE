<?php

namespace App\Http\Controllers;

use App\Models\Level;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function addLevel(Request $request)
    {
        $request->validate([
            'year' => 'integer|required',
        ]);

        Level::create([
            'domaine' => $request['domaine'],
            'cycle' => $request['cycle'],
            'speciality' => $request['speciality'],
            'year' => $request['year'],
        ]);

        return Response(200);
    }

    public function levels($id=null)
    {

            
        if ($id) {
            $levels = Level::find($id);
        } else {$levels = Level::all();
        }
        return $levels;
    }

    public function deleteLevel($id = null)
    {
        if (!$id) {
            abort(404);
        }
        $Level = Level::find($id);
        if (!$Level) {
            abort(404);
        }
        $Level->delete();
        return Response(200);
    }

    public function editLevel(Request $request, $id)
    {
        $request->validate([
            'year' => 'integer|required',
        ]);
        if (!$id) {
            abort(404);
        }
        $level = Level::find($id);
        if (!$level) {
            abort(404);
        }
        $level->update([
            'domaine' => $request['domaine'],
            'cycle' => $request['cycle'],
            'speciality' => $request['speciality'],
            'year' => $request['year'],
        ]);
        return Response(200);
    }
}
