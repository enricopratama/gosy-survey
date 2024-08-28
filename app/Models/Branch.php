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

    protected $primary_key = 'BranchCode';
}
