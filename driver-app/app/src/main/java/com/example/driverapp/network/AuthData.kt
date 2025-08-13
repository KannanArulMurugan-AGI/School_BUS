package com.example.driverapp.network

data class TokenRequest(
    val userId: String,
    val tenantId: String,
    val role: String
)

data class TokenResponse(
    val token: String
)
