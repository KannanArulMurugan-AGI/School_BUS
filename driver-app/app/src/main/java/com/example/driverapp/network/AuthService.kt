package com.example.driverapp.network

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("/auth/token")
    suspend fun getCustomToken(@Body request: TokenRequest): Response<TokenResponse>
}
