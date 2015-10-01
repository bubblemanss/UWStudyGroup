package com.example.StudyGroupFinder;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

/**
 * Created by Kai Jun on 2015-06-27.
 */
public class PostRequestCreate extends AsyncTask<String, Void, String> {
    private MainActivity activity;

    public PostRequestCreate(MainActivity activity) {
        super();
        this.activity = activity;
    }

    @Override
    protected String doInBackground(String... params) {
        OutputStreamWriter osw;
        BufferedReader reader;
        JSONObject json = new JSONObject();
        try {
            String urlString = params[0];
            String courseCode = params[1];
            String building = params[2];
            String room = params[3];
            String people = params[4];
            json.put("code", courseCode);
            json.put("building", building);
            json.put("room", room);
            json.put("people", people);
            Log.d("DEBUGKAI", json.toString());

            // Setup connection
            URL url = new URL(urlString);
            HttpURLConnection connection;
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestMethod("POST");
            connection.connect();

            // Send POST
            OutputStream output = connection.getOutputStream();
            Log.d("DEBUGKAI", "After connect");
            osw = new OutputStreamWriter(output);

            osw.write(json.toString());
            osw.flush();
            osw.close();

            // Handle response
            reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            reader.close();
        } catch (MalformedURLException e1) {
            e1.printStackTrace();
        } catch (ProtocolException e1) {
            e1.printStackTrace();
        } catch (IOException e1) {
            e1.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }
}
