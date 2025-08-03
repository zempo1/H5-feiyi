import { useuserStore } from "@/stores/user";
const userStore = useuserStore();
export function saveData(data = {}) {
    userStore.setAccessToken(data.accessToken);
    userStore.setRefreshToken(data.refreshToken);
    userStore.setUserInfo(data);
}