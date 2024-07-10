<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MstUser extends Model
{
    use HasFactory;

    protected $table = 'mst_user';
    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';
    // public $timestamps = false;
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    protected $fillable = [
        'user_login',
        'user_password',
        'salesman_code',
        'account_name',
        'user_group_id',
        'data_status',
        'last_login',
        'device_id',
        'firebase_token_access',
        'is_update_password',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'phone_numbers',
    ];

    // Define the date format for datetime fields
    protected $casts = [
        'last_login' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
