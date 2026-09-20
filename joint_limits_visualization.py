import numpy as np
import matplotlib.pyplot as plt

# 中文显示设置；优先使用环境可用的中文字体
plt.rcParams["font.sans-serif"] = [
    "Noto Sans CJK SC",
    "WenQuanYi Micro Hei",
    "SimHei",
    "Microsoft YaHei",
    "Arial Unicode MS",
    "DejaVu Sans",
]
plt.rcParams["axes.unicode_minus"] = False

# 数据：关节序号, 关节名称, 下限(rad), 上限(rad)
joints = [
    (0, "L_LEG_HIP_PITCH", -2.5307, 2.8798),
    (1, "L_LEG_HIP_ROLL", -0.5236, 2.9671),
    (2, "L_LEG_HIP_YAW", -2.7576, 2.7576),
    (3, "L_LEG_KNEE", -0.087267, 2.8798),
    (4, "L_LEG_ANKLE_PITCH", -0.87267, 0.5236),
    (5, "L_LEG_ANKLE_ROLL", -0.2618, 0.2618),
    (6, "R_LEG_HIP_PITCH", -2.5307, 2.8798),
    (7, "R_LEG_HIP_ROLL", -2.9671, 0.5236),
    (8, "R_LEG_HIP_YAW", -2.7576, 2.7576),
    (9, "R_LEG_KNEE", -0.087267, 2.8798),
    (10, "R_LEG_ANKLE_PITCH", -0.87267, 0.5236),
    (11, "R_LEG_ANKLE_ROLL", -0.2618, 0.2618),
    (12, "WAIST_YAW", -2.618, 2.618),
    (13, "WAIST_ROLL", -0.52, 0.52),
    (14, "WAIST_PITCH", -0.52, 0.52),
    (15, "L_SHOULDER_PITCH", -3.0892, 2.6704),
    (16, "L_SHOULDER_ROLL", -1.5882, 2.2515),
    (17, "L_SHOULDER_YAW", -2.618, 2.618),
    (18, "L_ELBOW", -1.0472, 2.0944),
    (19, "L_WRIST_ROLL", -1.972222054, 1.972222054),
    (20, "L_WRIST_PITCH", -1.614429558, 1.614429558),
    (21, "L_WRIST_YAW", -1.614429558, 1.614429558),
    (22, "R_SHOULDER_PITCH", -3.0892, 2.6704),
    (23, "R_SHOULDER_ROLL", -2.2515, 1.5882),
    (24, "R_SHOULDER_YAW", -2.618, 2.618),
    (25, "R_ELBOW", -1.0472, 2.0944),
    (26, "R_WRIST_ROLL", -1.972222054, 1.972222054),
    (27, "R_WRIST_PITCH", -1.614429558, 1.614429558),
    (28, "R_WRIST_YAW", -1.614429558, 1.614429558),
]

ids = [j[0] for j in joints]
names = [j[1] for j in joints]
low_rad = np.array([j[2] for j in joints])
high_rad = np.array([j[3] for j in joints])

# 弧度转角度
low_deg = np.degrees(low_rad)
high_deg = np.degrees(high_rad)
span_deg = high_deg - low_deg
y = np.arange(len(joints))

fig, ax = plt.subplots(figsize=(14, 13))

# 颜色按总范围大小变化
colors = plt.cm.viridis(
    (span_deg - span_deg.min()) / (span_deg.max() - span_deg.min())
)

ax.barh(
    y,
    span_deg,
    left=low_deg,
    color=colors,
    alpha=0.9,
    edgecolor="black",
    linewidth=0.3,
)

# 0 度参考线
ax.axvline(0, color="black", linewidth=1)
ax.set_yticks(y)
ax.set_yticklabels([f"{i:02d} {n}" for i, n in zip(ids, names)], fontsize=9)
ax.invert_yaxis()
ax.set_xlabel("关节角度（度）")
ax.set_ylabel("关节序号与名称")
ax.set_title(
    "各关节限位范围与最大转角\n"
    "右端=最大正向转角，左端=最大反向转角，条长=总转角范围"
)
ax.grid(axis="x", linestyle="--", alpha=0.35)

# 标注最大正向转角
for yi, hi in zip(y, high_deg):
    ax.text(hi + 2, yi, f"{hi:.1f}°", va="center", fontsize=7)
ax.set_xlim(low_deg.min() - 20, high_deg.max() + 35)

plt.tight_layout()
plt.savefig("/workspace/joint_limits_visualization.png", dpi=200)
print("Saved: /workspace/joint_limits_visualization.png")
