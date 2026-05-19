<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Patient extends Model
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'location',
        'status',
        'last_visit',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function routeNotificationForTwilio(): ?string
    {
        return $this->phone;
    }
}
