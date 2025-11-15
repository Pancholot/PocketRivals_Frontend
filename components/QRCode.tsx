import QRCode from "react-native-qrcode-svg";

interface QRProps {
  value: string;
}

export default function QRCodeComponent({ value }: QRProps) {
  return (
    <QRCode value={value} size={240} color="black" backgroundColor="white" />
  );
}
