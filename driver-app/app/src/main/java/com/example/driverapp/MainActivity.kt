package com.example.driverapp

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.driverapp.databinding.ActivityMainBinding
import com.example.driverapp.network.AuthService
import com.example.driverapp.network.TokenRequest
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var auth: FirebaseAuth

    // Use 10.0.2.2 to connect to the host machine's localhost from the Android emulator
    private val authService: AuthService by lazy {
        Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AuthService::class.java)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()

        binding.loginButton.setOnClickListener {
            handleLogin()
        }
    }

    private fun handleLogin() {
        val tenantId = binding.tenantIdEditText.text.toString().trim()
        if (tenantId.isEmpty()) {
            binding.statusTextView.text = "Status: Tenant ID cannot be empty."
            return
        }

        // Hardcoded for now as per the plan
        val userId = "driver-007"
        val role = "driver"

        setLoading(true)

        lifecycleScope.launch {
            try {
                val request = TokenRequest(userId, tenantId, role)
                val response = authService.getCustomToken(request)

                if (response.isSuccessful && response.body() != null) {
                    val customToken = response.body()!!.token
                    signInWithFirebase(customToken, tenantId)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Unknown error"
                    Log.e(TAG, "API Error: ${response.code()} - $errorBody")
                    binding.statusTextView.text = "Status: Failed to get token. ${response.message()}"
                    setLoading(false)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Network Error: ${e.message}", e)
                binding.statusTextView.text = "Status: Network error. Is the server running?"
                setLoading(false)
            }
        }
    }

    private fun signInWithFirebase(token: String, tenantId: String) {
        auth.signInWithCustomToken(token)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    Log.d(TAG, "signInWithCustomToken:success")
                    binding.statusTextView.text = "Status: Firebase sign-in successful!"

                    // Launch RouteSelectionActivity
                    val intent = Intent(this, RouteSelectionActivity::class.java).apply {
                        putExtra(RouteSelectionActivity.EXTRA_TENANT_ID, tenantId)
                    }
                    startActivity(intent)
                    finish() // Close MainActivity

                } else {
                    Log.w(TAG, "signInWithCustomToken:failure", task.exception)
                    binding.statusTextView.text = "Status: Firebase Authentication failed."
                }
                setLoading(false)
            }
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.loginButton.isEnabled = !isLoading
        binding.tenantIdEditText.isEnabled = !isLoading
    }

    companion object {
        private const val TAG = "MainActivity"
    }
}
