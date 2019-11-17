<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Project;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $project = Project::where('is_completed', false)
        ->orderBy('created_at', "desc")
        ->withCount(['tasks'=>function ($query) {
            $query->where('is_completed', false);
        }])->get();

        return $project->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validateData = $request->validate([
            "name"=>"required",
            "description"=>"required"
        ]);
        $project =  Project::create([
            "name"=>$validateData["name"],
            "description"=>$validateData["description"]
        ]);

        return response()->json("Project created");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $project = Project::with(['tasks'=>function ($query) {
            $query->where('is_completed', false);
        }])->find($id);
        return $project->toJson();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Project $project)
    {
        $project->is_completed=true;
        $project->update();

        return response()->json("Project update");
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    // public function markAsCompleted(Project $project){
    //     $project->is_completed=true;
    //     $project->update();

    //     return response()->json("Project update");
    // }
}
