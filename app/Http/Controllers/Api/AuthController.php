<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {

    public function login(LoginRequest $request) {
        $userDetails = $request->validated();
        if (!Auth::attempt($userDetails)) {
            return response([
                "message" => "Provided email or password is incorrect"
            ], 422);
        }
        /**@var User $user */
        $user = Auth::user();
        $token = $user->createToken("main")->plainTextToken;
        return response([
            "user" => $user,
            "token" => $token
        ]);
    }

    public function signup(SignupRequest $request) {
        $data =  $request->validated();
        $data['name'] = $this->capitalizeName($data['name']);

        $user =  User::create([
            "name" => $data["name"],
            "email" => $data["email"],
            "password" => bcrypt($data["password"]),
        ]);

        $token = $user->createToken("name")->plainTextToken;
        return response(compact("user", "token"));
    }

    public function logout(Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response("", 204);
    }


    private function capitalizeName($name) {

        $words = explode(' ', $name);
        $capitalizedWords = array_map(
            function ($word) {
                return ucfirst(strtolower($word));
            },
            $words
        );
        return implode(' ', $capitalizedWords);
    }
}
