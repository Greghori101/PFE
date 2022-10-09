<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller
{
    //

    public function send(Request $request)
    {
        $request->validate([
            'title' => 'string|required',
            'type' => 'string|required',
            'content' => 'string|required',
            'to' => 'required',
        ]);

        $notification = Notification::create([
            'title' => $request['title'],
            'type' => $request['type'],
            'content' => $request['content'],
        ]);

        $from = User::find(Auth::id());
        $to = User::find($request->to);
        $to->received_notifications()->save($notification);
        $from->sent_notifications()->save($notification);


        return Response(200);
    }

    public function notifications($id = null)
    {
        $user = Auth::user();

        if ($id) {
            $notifications = Notification::find($id);
        } else {
            $notifications = $user->received_notifications->where('displayed', 0);
        }
        $list = [];
        foreach ($notifications as $notification) {
            $notification['from'] = User::find($notification->to);
            array_push($list, $notification);
        }
        return $list;
    }
    public function all()
    {
        $user = Auth::user();

        $notifications = $user->received_notifications->all();

        $list = [];
        foreach ($notifications as $notification) {
            $notification['from'] = User::find($notification->to);
            array_push($list, $notification);
        }
        return $list;
    }

    public function seen($id = null)
    {
        if (!$id) {
            $user = Auth::user();
            $notifications = $user->received_notifications->all();

            foreach ($notifications as $notification) {

                $notification->update(['displayed' => true]);
            }
            return Response(200);
        } else {

            $notification = Notification::find($id);
            if (!$notification) {
                abort(404);
            }
            $notification->update(['displayed' => true]);
            return Response(200);
        }
    }

    public function delete($id = null)
    {

        if (!$id) {
            $user = Auth::user();
            $notifications = $user->received_notifications->all();

            foreach ($notifications as $notification) {

                $notification->delete();
            }
            return Response(200);
        } else {
            $notification = Notification::find($id);
            $notification->delete();

            return Response(200);
        }
    }
}
