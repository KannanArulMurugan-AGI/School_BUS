package com.example.driverapp.models

import com.google.firebase.database.Exclude

data class Route(
    @get:Exclude // Exclude from Firebase serialization when writing
    var id: String = "",
    var name: String = ""
)
