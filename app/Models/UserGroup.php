<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserGroup extends Model
{
    use HasFactory;
    protected $table = 'mst_user_group';
    protected $primaryKey = 'user_group_id';
    public $incrementing = true;
    protected $keyType = 'int';
    // public $timestamps = false;
    public const CREATED_AT = 'created_at';
    public const UPDATED_AT = 'updated_at';
    protected $fillable = [
        'user_group_id',
        'user_group_name',
        'user_mobile',
        'user_status',
        'created_by',
        'updated_at',
        'updated_by',
    ];
}
