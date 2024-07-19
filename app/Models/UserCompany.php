<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCompany extends Model
{
    use HasFactory;
    protected $table = 'mst_user_company';
    protected $primaryKey = 'user_company_id';
    public $incrementing = true;
    protected $keyType = 'int';
    // public $timestamps = false;
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    protected $fillable = [
        'user_id',
        'company_code',
        'data_status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
    ];
    public function mstUser()
    {
        return $this->belongsTo('App\Models\User', 'user_id', 'user_id');
    }
}
