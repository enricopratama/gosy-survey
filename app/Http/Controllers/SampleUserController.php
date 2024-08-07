<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller as ParentController;;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserData;
use App\Models\UserCompany;
use App\Models\VCustomer;
use Illuminate\Support\Facades\Hash;


use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use DB;

class UserController extends ParentController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return \Inertia::render('Users/Index', [
        ]);
    }

    public function data(Request $request){
       $user=$request->user();
       $idactor=$user->user_id;
       $jobrole=$user->job_role_id;
       $company=explode(',',$user->company_id.','.$user->additional_02);

    //    if($user->user_group_code=='SU') $data=User::selectRaw('*');
        // else $data=User::selectRaw('*')->where(['job_role_id'=>$jobrole])->whereIn('company_id',$company);

        $company=\Session::get('company');
        $permission=session()->get('permission');
        $admin=(in_array('USERS_admin',$permission))?true:false;
        

        $data=User::selectRaw("*");

        if($user->user_group_code!='SU'){
            $data->where(function($q) use($admin,$idactor,$company){
                if(!$admin) $q->where('user_id','=',$idactor);
                else{ foreach ($company as $c) {
                        $q->orWhere(function($w) use($c){
                            $w->where(['job_role_id'=>$c['job_role_id'],'company_id'=>$c['company_id']]);
                        });
                    }
                }
            });
        }


        if($request->has('search')) 
            if($request->get('search')!=''){
                $s=$request->get('search');
                $data->whereRaw("( user_code  ~* '$s' or user_name ~* '$s' or user_login ~* '$s')");
            }

        // if($request->has('status')) 
        //     if($request->get('status')==1) $data->where("data_status",'=','1');
        //     elseif($request->get('status')==0) $data->whereRaw("(data_status = 0 or data_status is null)");
      

      
        if($request->has('company')){
            $company=$request->get('company');
            if(!is_array($company)) $company=explode(',',$company);
            if(count($company)>0) $data->whereIn("company_id",$company);
            else  $data->where("company_id",0);
            
        }


        $data->orderBy('user_id','desc');
        return \Vuetable::of($data)
            ->addColumn('akses',function($d){
                $mobile=($d->access_mobile==1)?'<i class="fas fa-mobile-android text-primary me-2 fa-2x"></i>':
                '<span class="fa-stack me-2" style="vertical-align: top;">
                    <i class="fas fa-mobile-android fa-stack-2x text-muted"></i>
                    <i class="fas fa-slash fa-stack-2x text-muted"></i>
                </span>';
                $dekstop=($d->access_web==1)?'<i class="me-1 fas fa-desktop-alt text-info fa-2x"></i>':
                '<span class="fa-stack me-2" style="vertical-align: top;">
                    <i class="fas fa-desktop-alt fa-stack-2x text-muted"></i>
                    <i class="fas fa-slash fa-stack-2x text-muted"></i>
                </span>';
                return $mobile.$dekstop;
            })->addColumn('action',function($d) use($permission){
               $act=[];
                    if(in_array('USERS_edit',$permission)){
                        $act[]=['icon'=>'fas fa-edit','action'=>'EDIT','text'=>'Edit'];
                        $act[]=['icon'=>'fas fa-key','action'=>'RESET','text'=>'Reset Password'];
                    }
                return $act;
            })
            ->make(); 
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request,$uid=null)
    {   
        $editdata=(object)[];
        $mode='ADD';
        $company=[];
        $jobrole=[];
        $usergroup=[];
        $spv=[];
        $companyadd=[];
        if($uid!=null){
            $editdata=UserData::where('user_id','=',$uid)->first();
            
            if(!$editdata) return redirect('/users');
            else{
                $mode='EDIT';
                $usergroup=DB::table('mst_user_group')->selectRaw("user_group_id::character varying as id,concat(user_group_name,' (',user_group_code,')') as text")->where('user_group_id',$editdata->user_group_id)->get()->toArray();
                $companyadd=DB::table('map_user_company')->selectRaw('user_company_id::character varying,job_role_id::character varying,company_id::character varying')->where('user_id',$uid)->get()->toArray();
                $coid=array_unique(array_column($companyadd,'company_id'));
                $jrid=array_unique(array_column($companyadd,'job_role_id'));
                $coid[]=$editdata->company_id;
                $jrid[]=$editdata->job_role_id;
                
                $company=DB::table('mst_company')->selectRaw("company_id::character varying as id,concat(company_name,' (',company_code,')') as text")->whereIn('company_id',$coid)->get()->toArray();

                $jobrole=DB::table('mst_job_role')->selectRaw("job_role_id::character varying as id,concat(job_role_name,' (',job_role_code,')') as text")->where('job_role_id',$jrid)->get()->toArray();
                $spv=DB::table('v_user_login')->selectRaw("user_id::character varying as id, concat(user_code,' - ',user_name,' (',company_code,'/',job_role_code,'/', user_group_name,')') as text")->where('user_id',$editdata->supervisor)->get()->toArray();
            }
        }
        // return \Inertia::render('Users/AddEdit', [
        //     'editdata'=>$editdata,
        //     'mode'=>$mode,
        // ]);
        return \Inertia::render('Users/AddEdit', [
            'editdata'=>$editdata,
            'mode'=>$mode,
            'company_option'=>$company,
            'usergroup_option'=>$usergroup,
            'jobrole_option'=>$jobrole,
            'svp_option'=>$spv,
            'company_list'=>$companyadd
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $idactor=$request->user()->user_id;

        $validator = Validator::make($request->all(), [
            'user_code' => 'required|unique:mst_user,user_code',
            'user_name' => 'required',
            'user_group_id' => 'required',
            'company_id' => 'required',
            'job_role_id' => 'required',
            'data_status' => 'numeric|required',
            'phone_number' =>'numeric|nullable',
            'additional_01' =>'numeric|nullable',
            'email_address'=>'email|nullable',
            'supervisior'=>'numeric'
        ]);

        if ($validator->fails()) {
            $error=$validator->errors();
            $mess=['Validasi Error!'];
            foreach($error as $e) $mess[]=implode(' | ',$e);
            return response()->json(['status' => 1,'message' => implode(' | ',$mess),'data'=>$validator->errors()] , 200);
        }

        $rand=date('Ymd').sprintf('%04d', rand(0,9999));

        DB::beginTransaction();
        $new=UserData::create([
                'user_code' => $rand,
                'user_login' => $rand,
                'user_name' =>  $request->user_name,
                'user_group_id' =>  $request->user_group_id,
                'company_id' =>  $request->company_id,
                'job_role_id' =>  $request->job_role_id,
                'data_status' =>  $request->data_status,
                'phone_number' => $request->phone_number,
                'email_address'=> $request->email_address,
                'user_password'=>Hash::make('GONUSAJAYA'),
                'supervisior'=>$request->supervior,
                'additional_01'=>($request->additional_01==1)?1:0,
            ]);
        if($new){
            DB::commit();
            // return redirect()->route('users')->with('message', 'Data Berhasil Disimpan!');
            return response()->json(['status' => 1,'message' => "Berhasil Disimpan",'data'=>[]], 200);


        }
                // if(isset($d['user_id'])) unset($d['user_id']);
                // $rand=date('Ymd').sprintf('%04d', rand(0,9999));
                // $d['user_code']=$rand;
                // $d['user_login']=$rand;
                // $d['created_at']=date('Y-m-d H:i:s');
                // $d['created_by']=$idactor;
                // $d['user_password']=Hash::make('GONUSAJAYA');
                // $insert[]=$d;
            
            // $doinsert=\JSONIN::Inserting('mst_user',$insert,'user_id');
            // return response()->json($doinsert, 200);
        //   return response()->json(['status' => 2,'message' => "Validasi Error ".implode(',',$in['checked']),'data'=>$in['data']], 200);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

  

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $idactor=$request->user()->user_id;

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:mst_user,user_id',
            'user_code' => ['required',Rule::unique('mst_user','user_code')->ignore($request->user_id,'user_id')],
            'user_name' => 'required',
            'user_group_id' => 'required',
            'company_id' => 'required',
            'job_role_id' => 'required',
            'data_status' => 'numeric|required',
            'phone_number' =>'numeric|nullable',
            'email_address'=>'email|nullable',
            'supervisor'=>'numeric|nullable',
            'company_add'=>''
        ]);
        if ($validator->fails()) {
            $error=$validator->errors();
            $mess=['Validasi Error!'];
            foreach($error as $e) $mess[]=implode(' | ',$e);
            return response()->json(['status' => 1,'message' => implode(' | ',$mess),'data'=>$validator->errors()] , 200);
        }

        $rand=date('Ymd').sprintf('%04d', rand(0,9999));

        

        DB::beginTransaction();
  
        $new=UserData::where('user_id',$request->user_id)->update([
                // 'user_code' => $rand,
                // 'user_login' => $rand,
                'user_name' =>  $request->user_name,
                'user_group_id' =>  $request->user_group_id,
                'company_id' =>  $request->company_id,
                'job_role_id' =>  $request->job_role_id,
                'data_status' =>  $request->data_status,
                'phone_number' => $request->phone_number,
                'email_address'=> $request->email_address,
                'updated_by'=>$idactor,
                // 'user_password'=>Hash::make('GONUSAJAYA'),
                'supervisor'=>$request->supervor
            ]);
        if($new){
            UserCompany::where('user_id',$request->user_id)->update(['data_status'=>1,'updated_by'=>$idactor]);
            $comadd=[];
            $com=json_decode($request->company_add);
            // print_r($request)
            if(is_array($com)){
                foreach ($com as $r) {
                    $c=(array)$r;
                    $c['data_status']=1;
                    $c['updated_by']=$idactor;
                    $c['user_id']=$request->user_id;
                    unset($c['user_company_id']);
                    $comadd[]=$c;
                }

                $addcompany=UserCompany::upsert($comadd,['user_id','job_role_id','company_id'],['data_status'=>1,'updated_by'=>$idactor]);
            }
            DB::commit();
            return response()->json(['status' => 1,'message' => "Berhasil Disimpan",'data'=>[]], 200);

            // return redirect()->route('users')->with('message', 'Data Berhasil Disimpan!');
                // ->where('user_id',$request->user_id);
            // if(count($comadd)>0 && $addcompany){
            //     DB::commit();
            //     return redirect()->route('users')->with('message', 'Data Berhasil Disimpan!');
            // }else{
            //      DB::rollback();
            //     //  return back()->with('message','Gagal Menyimpan data, Company tambahan tidak bisa di input');
            //     //  ->withInput();
            //     return redirect("/users/edit/$request->user_id")->with('message','Gagal Menyimpan data, Company tambahan tidak bisa di input');
            //     //  ->withInput();
            // }

        }else{
            DB::rollback();
            return response()->json(['status' => 0,'message' => "Gagal Disimpan",'data'=>[]], 200);

            // return redirect("/users/edit/$request->user_id")->with('message','Gagal Menyimpan data');
                //  ->withInput();
                //  ->withInput();
        }
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

    
}
