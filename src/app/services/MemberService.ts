import api from "./api";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

/** Landing page statistikasi (real DB hisoblari) */
export interface HomeStats {
  athletes: number;
  products: number;
  orders: number;
}

class MemberService {
  /** Landing page statistikasi — hardcoded raqamlar o'rniga */
  public async getStats(): Promise<HomeStats> {
    try {
      const result = await api.get("/member/stats");
      return result.data;
    } catch (err) {
      console.error("Error, getStats:", err);
      throw err;
    }
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const result = await api.get("/member/top-users");
      return result.data;
    } catch (err) {
      console.error("Error, getTopUsers:", err);
      throw err;
    }
  }

  /** Newsletter obunasi — ComingSoon seksiyasidagi email formasi uchun */
  public async subscribe(email: string): Promise<void> {
    try {
      await api.post("/member/subscribe", { subscriberEmail: email });
    } catch (err) {
      console.error("Error, subscribe:", err);
      throw err;
    }
  }

  public async getShop(): Promise<Member> {
    try {
      // Backend javobi { result } ko'rinishida o'ralgan
      const result = await api.get("/member/shop");
      return result.data.result;
    } catch (err) {
      console.error("Error, getShop:", err);
      throw err;
    }
  }

  /** Cookie'dagi token hali amal qilishini serverdan tasdiqlaydi */
  public async getMemberDetail(): Promise<Member> {
    const result = await api.get("/member/detail");
    const member: Member = result.data.result;
    localStorage.setItem("memberData", JSON.stringify(member));
    return member;
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const result = await api.post("/member/signup", input);
      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.error("Error, signup:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const result = await api.post("/member/login", input);
      const member: Member = result.data.member;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.error("Error, login:", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      await api.post("/member/logout", {});
      localStorage.removeItem("memberData");
    } catch (err) {
      console.error("Error, logout:", err);
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      // Faqat to'ldirilgan maydonlar yuboriladi — bo'sh string mavjud
      // qiymatni o'chirib yubormasligi uchun
      const formData = new FormData();
      if (input.memberNick) formData.append("memberNick", input.memberNick);
      if (input.memberPhone) formData.append("memberPhone", input.memberPhone);
      if (input.memberAddress)
        formData.append("memberAddress", input.memberAddress);
      if (input.memberDesc) formData.append("memberDesc", input.memberDesc);
      if (input.memberPassword)
        formData.append("memberPassword", input.memberPassword);
      if (input.memberImage instanceof File)
        formData.append("memberImage", input.memberImage);

      const result = await api.post("/member/update", formData);

      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.error("Error, updateMember:", err);
      throw err;
    }
  }
}

export default MemberService;
