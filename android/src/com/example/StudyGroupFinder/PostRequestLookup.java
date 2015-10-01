package com.example.StudyGroupFinder;


import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

/**
 * Created by Kai Jun on 2015-06-26.
 */
public class PostRequestLookup extends AsyncTask<String, Void, String> {
    private MainActivity activity;

    public PostRequestLookup(MainActivity activity) {
        super();
        this.activity = activity;
    }

    @Override
    protected String doInBackground(String... params) {
        StringBuilder sb = new StringBuilder();
        OutputStreamWriter osw;
        BufferedReader reader;
        try {
            String urlString = params[0];
            String courseCode = params[1];
            StringBuilder body = new StringBuilder();
            body.append("{\"code\":\"").append(courseCode).append("\"}");
            Log.d("DEBUGKAI", body.toString());

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

            osw.write(body.toString());
            osw.flush();
            osw.close();

            // Handle response
            reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

            String line = null;
            // Read Server Response
            while((line = reader.readLine()) != null)
            {
                // Append server response in string
                sb.append(line + "\n");
            }
            reader.close();
            Log.d("DEBUGKAI", sb.toString());
        } catch (MalformedURLException e1) {
            e1.printStackTrace();
        } catch (ProtocolException e1) {
            e1.printStackTrace();
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        return sb.toString();
    }

    @Override
    protected void onPostExecute(String s) {
        super.onPostExecute(s);
        if (s != "") {
            try {
                startmap(s);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            TextView t =(TextView)activity.findViewById(R.id.error_msgs);
            t.setText("No study groups found.");
        }

        Log.e("DEBUGKAI", s);
    }

    public void startmap(String json) {
        Intent intent = new Intent(this.activity, MapActivity.class);
        intent.putExtra("json", json);
        this.activity.startActivity(intent);
    }
}
