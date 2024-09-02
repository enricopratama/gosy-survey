<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrxSurvey extends Model
{
    use HasFactory;

    protected $table = 'trx_survey';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'survey_datetime',
        'user_id',
        'company_code',
        'branch_code',
        'customer_code',
        'customer_name',
        'customer_address',
        'outlet_class',
        'kecamatan',
        'survey_id',
        'question_id',
        'user_answer',
        'data_status',
        'created_by',
        'updated_by',
        'temp_header_id',
    ];

    protected $primaryKey = 'trx_id';

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'survey_datetime' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The attributes that are automatically managed by Eloquent (auto-increment, primary key).
     *
     * @var array<string, string|int>
     */
    protected $keyType = 'int';

    /**
     * Relationship with the Survey model.
     */
    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id');
    }

    /**
     * Relationship with the Question model.
     */
    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}
