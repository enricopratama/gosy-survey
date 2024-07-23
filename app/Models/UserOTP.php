<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserOTP extends Model
{
    use HasFactory;
    protected $table = 'mst_otp_user_ac';
    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';
    // public $timestamps = false;
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    protected $fillable = [
        'id',
        'user_id',
        'otp_value',
        'generate_otp_time',
        'expired_otp_time',
        'is_using_otp',
        'is_using_by_user',
        'is_using_at',
        'created_by',
        'updated_at',
    ];
}
