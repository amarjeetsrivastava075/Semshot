"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebase";

type UserProfile = {
  name?: string;
  email?: string;
  universityId?: string;
  courseId?: string;
  branchId?: string;
  semesterId?: string;
  profileCompleted?: boolean;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  profileCompleted: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: true,
  profileCompleted: false,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (!currentUser) {
          setProfile(null);
          setProfileCompleted(false);
          setProfileLoading(false);
          setLoading(false);
          return;
        }

        setProfileLoading(true);

        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            setProfile(null);
            setProfileCompleted(false);
            return;
          }

          const userData = userSnap.data() as UserProfile;

          setProfile(userData);

          const completed =
            userData.profileCompleted === true &&
            !!userData.universityId &&
            !!userData.courseId &&
            !!userData.branchId &&
            !!userData.semesterId;

          setProfileCompleted(completed);
        } catch (error) {
          console.error("Error loading user profile:", error);

          setProfile(null);
          setProfileCompleted(false);
        } finally {
          setProfileLoading(false);
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        profileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);