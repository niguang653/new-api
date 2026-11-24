/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

/**
 * 首页动效样式表（逆向自灵珑AI CSS 产物，keyframes 参数保持原值）。
 * 由 Home 组件注入一次，所有 ll-* 类在该作用域内生效。
 */
export const HOME_STYLE_SHEET = `
@keyframes ll-drift {
  0%, 100% { transform: translate(0) scale(1); }
  50%      { transform: translate(40px, 30px) scale(1.08); }
}
.ll-drift     { animation: ll-drift 14s ease-in-out infinite; }
.ll-drift-rev { animation: ll-drift 18s ease-in-out infinite reverse; }

@keyframes ll-grid-floor {
  0% { background-position: 0 0; }
  to { background-position: 0 56px; }
}
.ll-grid-floor { animation: ll-grid-floor 3s linear infinite; }

@keyframes ll-caret {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.ll-caret { animation: ll-caret 1s step-end infinite; }

@keyframes ll-shine {
  0% { transform: translate(-120%) skew(-20deg); }
  60%, to { transform: translate(220%) skew(-20deg); }
}
.ll-sheen::after {
  content: '';
  position: absolute;
  inset: 0;
  width: 40%;
  background: linear-gradient(90deg, transparent, #ffffff40, transparent);
  animation: ll-sheen 3.2s ease-in-out infinite;
  pointer-events: none;
}

/* 标题高光：在渐变文字上叠加一条循环扫过的白色光带（背景裁剪到文字） */
@keyframes ll-shine-text {
  0%       { background-position: 220% 0, 0 0; }
  55%, to  { background-position: -120% 0, 0 0; }
}
.ll-shine-text {
  --ll-h1-gradient: linear-gradient(
    to bottom right,
    #030712 30%,
    #3d5bff 62%,
    #8b5cf6 100%
  );
  background-image:
    linear-gradient(100deg, transparent 42%, #ffffffcc 50%, transparent 58%),
    var(--ll-h1-gradient);
  background-size: 250% 100%, 100% 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ll-shine-text 6s linear infinite;
}
.dark .ll-shine-text {
  --ll-h1-gradient: linear-gradient(
    to bottom right,
    #ffffff 25%,
    #a5b4ff 62%,
    #d8b4fe 100%
  );
}


@keyframes logo-marquee {
  0%  { transform: translate(0); }
  to  { transform: translate(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .ll-caret,
  .ll-drift,
  .ll-drift-rev,
  .ll-grid-floor,
  .ll-shine-text,
  .ll-sheen::after { animation: none !important; }
}
`
