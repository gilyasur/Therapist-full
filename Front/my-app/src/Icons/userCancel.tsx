const UserXIcon: React.FC<{ width?: number; height?: number; color?: string }> = ({ width = 24, height = 24, color = '#2F4858' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" strokeWidth={1.75} stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
      <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
      <path d="M22 22l-5 -5" />
      <path d="M17 22l5 -5" />
    </svg>
  );

  export default UserXIcon;
