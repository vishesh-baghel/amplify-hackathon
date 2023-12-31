import { useEffect, useState } from "react";
import { Card, Heading, View } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import EditProfileLocal from "../EditProfileLocal/EditProfileLocal";
import React from "react";
import { Storage } from "aws-amplify";
import { Button } from "@aws-amplify/ui-react";
import { Analytics } from "aws-amplify";

export default function Profile() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());
    return () => setEndTime(new Date());
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
      Analytics.record({
        name: "timeOnProductSummaryPage",
        attributes: { timeOnPage: seconds },
      });
    }

    Analytics.autoTrack("session", {
      enable: true,
      attributes: {
        page: "Profile",
      },
    });

    Analytics.autoTrack("pageView", {
      enable: true,
      eventName: "pageView",
      type: "singlePageApp",
      provider: "AWSPinpoint",
      getUrl: () => {
        return window.location.origin + window.location.pathname;
      },
    });

    Analytics.autoTrack("event", {
      enable: true,
      events: ["click"],
      selectorPrefix: "data-amplify-analytics-name",
      provider: "AWSPinpoint",
    });
  }, [endTime]);

  const [user, setUser] = useState({
    attributes: {
      name: "",
      email: "",
      DateOfBirth: "",
      address: "",
      gender: "",
      phoneNumber: "",
      profilePhoto: "",
    },
  });

  const [userProfilePhoto, setUserProfilePhoto] = useState("");
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  useEffect(() => {
    getUserInfo();
    downloadFile(user);
  }, [userProfilePhoto]);

  async function getUserInfo() {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user);
  }

  const downloadFile = async (user) => {
    await Storage.get(`${user.attributes.picture}`, {
      level: "public",
    })
      .then((result) => {
        setUserProfilePhoto(result);
      })
      .catch((err) => console.log(err));
  };

  const closeModel = () => {
    setShowUpdateProfile(false);
  };

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "left",
          width: "100%",
        }}
      >
        <Heading
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            margin: "1rem 0 1rem 0",
          }}
          level={3}
        >
          Profile
        </Heading>
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "left",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <img
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
              src={userProfilePhoto}
              alt="profile"
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Heading
              style={{
                marginRight: "10px",
              }}
              level={4}
            >
              Name:
            </Heading>
            <p>{user.attributes.name}</p>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Heading
              style={{
                marginRight: "10px",
              }}
              level={4}
            >
              Email:
            </Heading>
            <p>{user.attributes.email}</p>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Heading
              style={{
                marginRight: "10px",
              }}
              level={4}
            >
              Address:
            </Heading>
            <p>{user.attributes.address}</p>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Heading
              style={{
                marginRight: "10px",
              }}
              level={4}
            >
              Gender:
            </Heading>
            <p>{user.attributes.gender}</p>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Heading
              style={{
                marginRight: "10px",
              }}
              level={4}
            >
              Phone Number:
            </Heading>
            <p>
              {user.attributes.phoneNumber
                ? user.attributes.phoneNumber
                : "none"}
            </p>
          </View>
          <Button
            onClick={() => setShowUpdateProfile(!showUpdateProfile)}
            data-amplify-analytics-name="updateProfileButton"
          >
            Update Profile
          </Button>
        </View>
      </View>

      <View
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          zIndex: "9998",
          display: showUpdateProfile ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showUpdateProfile && (
          <View style={{ zIndex: "9999" }}>
            <Card variation="elevated">
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Heading level={3}>Edit Profile</Heading>
                <Button
                  style={{
                    width: "4rem",
                    height: "2rem",
                    margin: "0 0 0 4rem",
                  }}
                  onClick={closeModel}
                  data-amplify-analytics-name="closeUpdateProfileButton"
                >
                  Close
                </Button>
              </View>
              <EditProfileLocal user={user} />
            </Card>
          </View>
        )}
      </View>
    </View>
  );
}
