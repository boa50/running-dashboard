from os import path, walk
import fitdecode


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


def get_activity_path(activity_name):
    return path.join(get_path("activities"), activity_name)


activities_names = next(walk(get_path("activities")), (None, None, []))[2]

frame_names = set(
    ["lap", "activity", "session", "sport", "record", "device_info", "event"]
)

activities = []

for activity_name in activities_names:
    activity = {
        "id": None,
        "sport": None,
        "start": None,
        "stop": None,
        "distance": None,
        "longitude": None,
        "latitude": None,
        "highest_temperature": -1000,
        "lowest_temperature": 1000,
        "highest_altitude": -10000,
        "lowest_altitude": 10000,
        "local_time": None,
        "ascent_total": None,
        "descent_total": None,
        "calories": None,
        "max_heart_rate": None,
        "duration_moving": None,
        "duration_total": None,
    }

    with fitdecode.FitReader(get_activity_path(activity_name)) as fit:
        for frame in fit:
            if frame.frame_type == fitdecode.FIT_FRAME_DATA:
                # if frame.name == "sport":
                #     if frame.has_field("sport"):
                #         activity["sport"] = frame.get_value("sport")

                if frame.name == "activity":
                    if frame.has_field("local_timestamp"):
                        activity["local_time"] = frame.get_value(
                            "local_timestamp"
                        ).strftime("%Y-%m-%dT%H:%M:%S%z")

                # if frame.name == "event":
                #     if frame.has_field("timer_trigger"):
                #         if frame.get_value("timer_trigger") == "manual":
                #             if frame.has_field("event_type"):
                #                 if frame.get_value("event_type") == "start":
                #                     if frame.has_field("event"):
                #                         if frame.get_value("event") == "timer":
                #                             if activity["start"] == None:
                #                                 activity["start"] = frame.get_value(
                #                                     "timestamp"
                #                                 ).strftime("%Y-%m-%dT%H:%M:%S%z")

                #     if frame.has_field("timer_trigger"):
                #         if frame.get_value("timer_trigger") == "manual":
                #             if frame.has_field("event_type"):
                #                 if frame.get_value("event_type") == "stop_all":
                #                     if frame.has_field("event"):
                #                         if frame.get_value("event") == "timer":
                #                             activity["stop"] = frame.get_value(
                #                                 "timestamp"
                #                             ).strftime("%Y-%m-%dT%H:%M:%S%z")

                if frame.name == "record":
                    # if frame.has_field("position_long"):
                    #     if activity["longitude"] == None:
                    #         activity["longitude"] = frame.get_value("position_long")

                    # if frame.has_field("position_lat"):
                    #     if activity["latitude"] == None:
                    #         activity["latitude"] = frame.get_value("position_lat")

                    if frame.has_field("temperature"):
                        field_value = frame.get_value("temperature")
                        if activity["highest_temperature"] < field_value:
                            activity["highest_temperature"] = field_value
                        if activity["lowest_temperature"] > field_value:
                            activity["lowest_temperature"] = field_value

                    if frame.has_field("altitude"):
                        field_value = frame.get_value("altitude")
                        if activity["highest_altitude"] < field_value:
                            activity["highest_altitude"] = field_value
                        if activity["lowest_altitude"] > field_value:
                            activity["lowest_altitude"] = field_value

                # if frame.name == "lap":
                #     if frame.has_field("total_ascent"):
                #         activity["ascent_total"] += frame.get_value("total_ascent")

                #     if frame.has_field("total_descent"):
                #         activity["descent_total"] += frame.get_value("total_descent")

                if frame.name == "session":
                    if frame.has_field("sport"):
                        activity["sport"] = frame.get_value("sport")

                    if frame.has_field("start_time"):
                        activity["id"] = frame.get_value("start_time").timestamp()

                        activity["start"] = frame.get_value("start_time").strftime(
                            "%Y-%m-%dT%H:%M:%S%z"
                        )

                    if frame.has_field("timestamp"):
                        activity["stop"] = frame.get_value("timestamp").strftime(
                            "%Y-%m-%dT%H:%M:%S%z"
                        )

                    if frame.has_field("total_timer_time"):
                        activity["duration_moving"] = frame.get_value(
                            "total_timer_time"
                        )

                    if frame.has_field("total_elapsed_time"):
                        activity["duration_total"] = frame.get_value(
                            "total_elapsed_time"
                        )

                    if frame.has_field("total_distance"):
                        activity["distance"] = frame.get_value("total_distance")

                    if frame.has_field("total_ascent"):
                        activity["ascent_total"] = frame.get_value("total_ascent")

                    if frame.has_field("total_descent"):
                        activity["descent_total"] = frame.get_value("total_descent")

                    if frame.has_field("start_position_long"):
                        activity["longitude"] = frame.get_value("start_position_long")

                    if frame.has_field("start_position_lat"):
                        activity["latitude"] = frame.get_value("start_position_lat")

                    if frame.has_field("max_heart_rate"):
                        activity["max_heart_rate"] = frame.get_value("max_heart_rate")

                    if frame.has_field("total_calories"):
                        activity["calories"] = frame.get_value("total_calories")

        activities.append(activity)

print(activities)
