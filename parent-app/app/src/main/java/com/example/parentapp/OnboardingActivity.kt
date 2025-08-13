package com.example.parentapp

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import com.google.firebase.auth.FirebaseAuth
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.util.UUID

class OnboardingActivity : AppCompatActivity() {

    private lateinit var tenantIdEditText: EditText
    private lateinit var startTrackingButton: Button
    private val client = OkHttpClient()
    private lateinit var auth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_onboarding)

        auth = FirebaseAuth.getInstance()

        tenantIdEditText = findViewById(R.id.tenantIdEditText)
        startTrackingButton = findViewById(R.id.startTrackingButton)

        startTrackingButton.setOnClickListener {
            val tenantId = tenantIdEditText.text.toString()
            if (tenantId.isNotEmpty()) {
                getCustomAuthToken(tenantId)
            }
        }
    }

    private fun getCustomAuthToken(tenantId: String) {
        val userId = UUID.randomUUID().toString()
        val role = "parent"

        val json = """
            {
                "userId": "$userId",
                "tenantId": "$tenantId",
                "role": "$role"
            }
        """.trimIndent()

        val requestBody = json.toRequestBody("application/json; charset=utf-8".toMediaType())

        val request = Request.Builder()
            .url("http://localhost:3000/auth/token") // Assuming the service runs locally
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("OnboardingActivity", "Failed to get auth token", e)
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body?.string()
                if (response.isSuccessful && responseBody != null) {
                    val jsonObject = JSONObject(responseBody)
                    val customToken = jsonObject.getString("token")
                    signInWithFirebase(customToken, tenantId)
                } else {
                    Log.e("OnboardingActivity", "Failed to get auth token: ${response.code}")
                }
            }
        })
    }

    private fun signInWithFirebase(token: String, tenantId: String) {
        auth.signInWithCustomToken(token)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign in success, update UI with the signed-in user's information
                    Log.d("OnboardingActivity", "signInWithCustomToken:success")
                    val user = auth.currentUser

                    // Save tenantId and UID
                    val sharedPref = getSharedPreferences("ParentAppPrefs", MODE_PRIVATE)
                    with(sharedPref.edit()) {
                        putString("tenantId", tenantId)
                        putString("uid", user?.uid)
                        apply()
                    }

                    // Navigate to MapActivity
                    val intent = Intent(this, MapActivity::class.java)
                    startActivity(intent)
                    finish() // Close the onboarding activity

                } else {
                    // If sign in fails, display a message to the user.
                    Log.w("OnboardingActivity", "signInWithCustomToken:failure", task.exception)
                }
            }
    }
}
