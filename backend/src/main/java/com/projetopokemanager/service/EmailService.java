package com.projetopokemanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendUrl + "/verificar-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Confirme sua conta - PokéManager");
        message.setText("""
                Bem-vindo ao PokéManager!

                Clique no link abaixo para confirmar sua conta:
                %s

                Se você não criou essa conta, ignore este e-mail.
                """.formatted(link));

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
    String link = frontendUrl + "/redefinir-senha?token=" + token;

    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(toEmail);
    message.setSubject("Redefinição de senha - PokéManager");
    message.setText("""
            Recebemos um pedido para redefinir sua senha.

            Clique no link abaixo para criar uma nova senha (válido por 30 minutos):
            %s

            Se você não pediu isso, ignore este e-mail — sua senha continua a mesma.
            """.formatted(link));

    mailSender.send(message);
}
}