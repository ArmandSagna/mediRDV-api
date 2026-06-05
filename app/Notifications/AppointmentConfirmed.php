<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\Twilio\TwilioChannel;
use NotificationChannels\Twilio\TwilioSmsMessage;

class AppointmentConfirmed extends Notification
{
    use Queueable;

    public function __construct(protected Appointment $appointment)
    {
    }

    public function via(object $notifiable): array
    {
        return [TwilioChannel::class];
    }

    public function toTwilio(object $notifiable): TwilioSmsMessage
    {
        $doctorName = $this->appointment->doctor?->name ?? 'votre praticien';
        $scheduledAt = $this->appointment->scheduled_at->format('d/m/Y \à H:i');

        return TwilioSmsMessage::create("Votre rendez-vous avec $doctorName est confirmé pour le $scheduledAt.")
            ->from(config('services.twilio.from'));
            
    }

    public function toMail(object $notifiable): MailMessage
    {
        $doctorName = $this->appointment->doctor?->name ?? 'votre praticien';
        $scheduledAt = $this->appointment->scheduled_at->format('d/m/Y \à H:i');

        return (new MailMessage)
            ->subject('Confirmation de votre rendez-vous')
            ->greeting('Bonjour ' . ($notifiable->name ?? ''))
            ->line("Votre rendez-vous avec $doctorName est confirmé pour le $scheduledAt.")
            ->line('Un SMS de confirmation a également été envoyé sur le numéro enregistré.')
            ->line('Merci d’utiliser mediRDV.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'doctor' => $this->appointment->doctor?->name,
            'scheduled_at' => $this->appointment->scheduled_at->toDateTimeString(),
            'message' => 'Votre rendez-vous a été confirmé.',
        ];
    }
}
