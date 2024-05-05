from os import path, walk
import fitdecode


def get_path(file_name):
    return path.join(path.dirname(path.realpath(__file__)), file_name)


def get_activity_path(activity_name):
    return path.join(get_path("activities"), activity_name)


activities_names = next(walk(get_path("activities")), (None, None, []))[2]

print(activities_names)

frame_names = set(
    ["lap", "activity", "session", "sport", "record", "device_info", "event"]
)


def get_value_if_exists(frame, field):
    if frame.has_field(field):
        print(field, ":", frame.get_value(field))


# with fitdecode.FitReader(get_activity_path(activities_names[0])) as fit:
#     for frame in fit:
#         if frame.frame_type == fitdecode.FIT_FRAME_DATA:
#             # frame_names.add(frame.name)
#             if frame.name in frame_names:
#                 frame_names.remove(frame.name)
#                 print()
#                 print("Frame Name:", frame.name)
#                 field_names = set([field.name for field in frame.fields])
#                 print("Fields:", field_names)


with fitdecode.FitReader(get_activity_path(activities_names[1])) as fit:
    for frame in fit:
        if frame.frame_type == fitdecode.FIT_FRAME_DATA:
            # if frame.name == "sport":
            #     if frame.has_field("sport"):
            #         get_value_if_exists(frame, "sport")
            #         get_value_if_exists(frame, "name")

            # if frame.name == "event":
            #     fields = [
            #         "timer_trigger",
            #         "timestamp",
            #         "event_group",
            #         "event_type",
            #         "event",
            #     ]
            #     [get_value_if_exists(frame, x) for x in fields]

            # if frame.name == "record":
            #     fields = [
            #         "position_long",
            #         "enhanced_altitude",
            #         "altitude",
            #         "heart_rate",
            #         "timestamp",
            #         "position_lat",
            #         "temperature",
            #         "enhanced_speed",
            #         "cadence",
            #         "speed",
            #         "distance",
            #         "fractional_cadence",
            #     ]
            #     [get_value_if_exists(frame, x) for x in fields]

            # if frame.name == "activity":
            #     fields = [
            #         "local_timestamp",
            #         "timestamp",
            #         "type",
            #         "event_group",
            #         "event_type",
            #         "num_sessions",
            #         "total_timer_time",
            #         "event",
            #     ]
            #     [get_value_if_exists(frame, x) for x in fields]

            # if frame.name == "lap":
            #     fields = [
            #         "unknown_96",
            #         "wkt_step_index",
            #         "sport",
            #         "start_position_long",
            #         "enhanced_max_speed",
            #         "avg_left_pco",
            #         "total_strides",
            #         "start_time",
            #         "avg_left_power_phase_peak",
            #         "unknown_28",
            #         "total_calories",
            #         "total_distance",
            #         "first_length_index",
            #         "avg_stroke_distance",
            #         "total_descent",
            #         "total_timer_time",
            #         "unknown_70",
            #         "max_power_position",
            #         "avg_right_pedal_smoothness",
            #         "total_ascent",
            #         "avg_running_cadence",
            #         "avg_cadence_position",
            #         "unknown_27",
            #         "normalized_power",
            #         "avg_stance_time_percent",
            #         "num_active_lengths",
            #         "lap_trigger",
            #         "avg_stance_time_balance",
            #         "intensity",
            #         "event_type",
            #         "unknown_73",
            #         "avg_left_power_phase",
            #         "enhanced_avg_speed",
            #         "avg_fractional_cadence",
            #         "event_group",
            #         "max_heart_rate",
            #         "sub_sport",
            #         "message_index",
            #         "avg_vertical_ratio",
            #         "total_fractional_cycles",
            #         "left_right_balance",
            #         "max_speed",
            #         "avg_vertical_oscillation",
            #         "max_fractional_cadence",
            #         "total_work",
            #         "swim_stroke",
            #         "time_in_power_zone",
            #         "time_standing",
            #         "avg_left_pedal_smoothness",
            #         "max_power",
            #         "unknown_97",
            #         "num_lengths",
            #         "time_in_hr_zone",
            #         "timestamp",
            #         "end_position_lat",
            #         "avg_power",
            #         "max_running_cadence",
            #         "unknown_90",
            #         "avg_heart_rate",
            #         "max_cadence_position",
            #         "avg_right_pco",
            #         "total_elapsed_time",
            #         "unknown_30",
            #         "avg_right_power_phase_peak",
            #         "end_position_long",
            #         "avg_left_torque_effectiveness",
            #         "avg_power_position",
            #         "stand_count",
            #         "avg_step_length",
            #         "avg_right_power_phase",
            #         "avg_right_torque_effectiveness",
            #         "unknown_29",
            #         "unknown_72",
            #         "avg_stance_time",
            #         "avg_speed",
            #         "event",
            #         "avg_combined_pedal_smoothness",
            #         "start_position_lat",
            #     ]
            #     [get_value_if_exists(frame, x) for x in fields]

            if frame.name == "session":
                fields = ["total_timer_time", "total_elapsed_time"]
                # fields = [
                #     "pool_length",
                #     "unknown_110",
                #     "sport",
                #     "start_position_long",
                #     "enhanced_max_speed",
                #     "avg_left_pco",
                #     "total_strides",
                #     "start_time",
                #     "avg_left_power_phase_peak",
                #     "unknown_108",
                #     "total_calories",
                #     "total_distance",
                #     "avg_stroke_distance",
                #     "total_descent",
                #     "total_timer_time",
                #     "max_power_position",
                #     "avg_right_pedal_smoothness",
                #     "total_ascent",
                #     "avg_running_cadence",
                #     "avg_cadence_position",
                #     "normalized_power",
                #     "unknown_80",
                #     "avg_stance_time_percent",
                #     "num_active_lengths",
                #     "avg_stance_time_balance",
                #     "event_type",
                #     "unknown_79",
                #     "unknown_107",
                #     "avg_left_power_phase",
                #     "enhanced_avg_speed",
                #     "avg_fractional_cadence",
                #     "event_group",
                #     "max_heart_rate",
                #     "unknown_109",
                #     "unknown_81",
                #     "sub_sport",
                #     "message_index",
                #     "avg_vertical_ratio",
                #     "nec_lat",
                #     "total_fractional_cycles",
                #     "unknown_78",
                #     "left_right_balance",
                #     "max_speed",
                #     "avg_vertical_oscillation",
                #     "max_fractional_cadence",
                #     "total_work",
                #     "swim_stroke",
                #     "time_in_power_zone",
                #     "time_standing",
                #     "trigger",
                #     "avg_left_pedal_smoothness",
                #     "max_power",
                #     "num_lengths",
                #     "time_in_hr_zone",
                #     "timestamp",
                #     "avg_power",
                #     "max_running_cadence",
                #     "swc_lat",
                #     "avg_heart_rate",
                #     "max_cadence_position",
                #     "avg_right_pco",
                #     "total_elapsed_time",
                #     "avg_right_power_phase_peak",
                #     "avg_left_torque_effectiveness",
                #     "training_stress_score",
                #     "avg_power_position",
                #     "stand_count",
                #     "avg_step_length",
                #     "avg_right_power_phase",
                #     "first_lap_index",
                #     "avg_right_torque_effectiveness",
                #     "swc_long",
                #     "nec_long",
                #     "threshold_power",
                #     "num_laps",
                #     "pool_length_unit",
                #     "intensity_factor",
                #     "avg_stance_time",
                #     "avg_speed",
                #     "total_training_effect",
                #     "event",
                #     "avg_combined_pedal_smoothness",
                #     "avg_stroke_count",
                #     "start_position_lat",
                # ]
                [get_value_if_exists(frame, x) for x in fields]
