<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Branch extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'gpd_mst_branch';

    protected $fillable = [
        'BranchCode',
        'CompanyCode',
        'RSO',
        'Area',
        'DSOAll',
        'CompanyName',
        'BranchName',
        'CreatedDate',
        'CreatedBy',
        'UpdatedDate',
        'UpdatedBy',
    ];

    protected $primaryKey = 'BranchCode';

    /**
     * Define a one-to-one relationship with the SurveyCompany model.
     */
    public function surveyCompany()
    {
        return $this->belongsTo(
            SurveyCompany::class,
            'CompanyCode',
            'company_code'
        );
    }
}
