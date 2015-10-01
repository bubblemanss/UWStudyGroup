package com.example.StudyGroupFinder;

import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Kai Jun on 2015-06-27.
 */
public class MapActivity extends FragmentActivity implements OnMapReadyCallback {
    private final float DEFAULT_ZOOM = 15;
    private JSONArray jsonArr;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        try {
            jsonArr = new JSONArray(getIntent().getStringExtra("json"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        mapFragment.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap map) {
        // Add a marker in Sydney, Australia, and move the camera.
        map.setMyLocationEnabled(true);
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        Location location = locationManager.getLastKnownLocation(locationManager.getBestProvider(criteria, false));
        if (location != null) {
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), DEFAULT_ZOOM));
        } else {
            // Zoom to the University of Waterloo
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(-80.544843, 43.472259), DEFAULT_ZOOM));
        }

        // Parse location data for markers
        for (int i = 0; i < jsonArr.length(); i++) {
            try {
                JSONObject json = jsonArr.getJSONObject(i);
                StringBuilder label = new StringBuilder();
                StringBuilder snippet = new StringBuilder();
                label.append("Course: ").append(json.getString("code"));

                snippet.append("Building: ").append(json.getString("building")).append(", ")
                        .append("Room: ").append(json.getString("room"));

                map.addMarker(new MarkerOptions().position(new LatLng(json.getDouble("latitude"), json.getDouble("longitude")))
                        .title(label.toString()).snippet(snippet.toString()))
                        .showInfoWindow();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    }
}