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

with fitdecode.FitReader(get_activity_path(activities_names[0])) as fit:
    for frame in fit:
        if frame.frame_type == fitdecode.FIT_FRAME_DATA:
            # frame_names.add(frame.name)
            if frame.name in frame_names:
                frame_names.remove(frame.name)
                print()
                print("Frame Name:", frame.name)
                field_names = set([field.name for field in frame.fields])
                print("Fields:", field_names)
