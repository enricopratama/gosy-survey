<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Branch;

class SurveyCompany extends Model
{
    use HasFactory;

    protected $table = 'mst_survey_company';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'survey_company_id',
        'survey_id',
        'company_code',
        'data_status',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $primaryKey = 'survey_company_id';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Define a one-to-one relationship with the Branch model.
     */
    public function branch()
    {
        return $this->hasOne(branch::class, 'CompanyCode', 'company_code');
    }

    /**
     * Define a relationship with the Survey model.
     */
    public function survey()
    {
        return $this->belongsTo(Survey::class, 'survey_id', 'survey_id');
    }
}
