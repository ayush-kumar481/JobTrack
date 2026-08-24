package com.jobtrack.controller;

import com.jobtrack.dto.ChangePasswordRequest;
import com.jobtrack.dto.ForgotPasswordRequest;
import com.jobtrack.dto.LoginRequest;
import com.jobtrack.dto.LoginResponse;
import com.jobtrack.dto.RegisterRequest;
import com.jobtrack.dto.ResetPasswordRequest;
import com.jobtrack.dto.UserResponse;
import com.jobtrack.model.User;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.security.JwtService;
import com.jobtrack.service.EmailService;

import jakarta.validation.Valid;

import java.util.Date;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;
    
    private final EmailService emailService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService, EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
		this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body("User not found");
        }

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        // Don't reveal whether the email exists
        if (user == null) {
            return ResponseEntity.ok(
                    "If an account exists with this email, a password reset link has been sent."
            );
        }

        // Generate reset token
        String resetToken = jwtService.generatePasswordResetToken(
                user.getEmail()
        );

        // Token expires after 15 minutes
        Date expiry = new Date(
                System.currentTimeMillis() + 15 * 60 * 1000
        );

        // IMPORTANT: Save token and expiry in MongoDB
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiry);

        userRepository.save(user);

        // Create reset link
        String resetLink =
                "http://localhost:5173/reset-password?token="
                        + resetToken;

        // Send email
        emailService.sendPasswordResetEmail(
                user.getEmail(),
                resetLink
        );

        return ResponseEntity.ok(
                "If an account exists with this email, a password reset link has been sent."
        );
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        if (!jwtService.isTokenValid(request.getToken()) ||
                !jwtService.isPasswordResetToken(request.getToken())) {

            return ResponseEntity.badRequest()
                    .body("Invalid or expired reset token.");
        }

        User user = userRepository
                .findByResetToken(request.getToken())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Invalid or expired reset token.");
        }

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().before(new Date())) {

            return ResponseEntity.badRequest()
                    .body("Invalid or expired reset token.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Password reset successfully."
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        // Get the email from the authenticated JWT user
        String email = authentication.getName();

        // Find the user
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body("User not found");
        }

        // Verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            return ResponseEntity.status(400)
                    .body("Current password is incorrect");
        }

        // Check that new password and confirmation match
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            return ResponseEntity.badRequest()
                    .body("New passwords do not match");
        }

        // Prevent using the same password
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            return ResponseEntity.badRequest()
                    .body("New password must be different from current password");
        }

        // Encode the new password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        // Save updated user
        userRepository.save(user);

        return ResponseEntity.ok(
                "Password changed successfully"
        );
    }
}