<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Question extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'mst_question_ori';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question_id',
        'question_no',
        'question_key',
        'question_group_id',
        'sequence',
        'is_parent',
        'question_name',
        'is_mandatory',
        'question_type',
        'option_1',
        'option_1_flow',
        'option_2',
        'option_2_flow',
        'option_3',
        'option_3_flow',
        'option_4',
        'option_4_flow',
        'option_5',
        'option_5_flow',
        'option_6',
        'option_6_flow',
        'option_7',
        'option_7_flow',
        'option_8',
        'option_8_flow',
        'option_9',
        'option_9_flow',
        'data_status',
        'created_at',
        'created_by',
        'updated_at',
        'updated_by',
        'options_size',
    ];

    protected $primaryKey = 'question_id';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
