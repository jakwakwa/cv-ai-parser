import { ImageResponse } from "next/og"

// Image metadata
export const alt = "Resume Library - CV AI Parser"
export const size = {
	width: 1200,
	height: 630,
}
export const contentType = "image/png"

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "Inter, system-ui, sans-serif",
				color: "white",
				position: "relative",
				overflow: "hidden",
				padding: 60,
			}}>
			{/* Background decorative elements */}
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: 400,
					height: 400,
					background: "rgba(255, 255, 255, 0.1)",
					borderRadius: "50%",
					transform: "translate(150px, -150px)",
					display: "block",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: 300,
					height: 300,
					background: "rgba(255, 255, 255, 0.08)",
					borderRadius: "50%",
					transform: "translate(-100px, 100px)",
					display: "block",
				}}
			/>

			{/* Main content */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					textAlign: "center",
					zIndex: 10,
					maxWidth: 900,
				}}>
				{/* Brand */}
				<div
					style={{
						fontSize: 24,
						fontWeight: "600",
						opacity: 0.9,
						marginBottom: 16,
						letterSpacing: "0.05em",
						display: "block",
					}}>
					CV AI PARSER
				</div>

				{/* Title */}
				<div
					style={{
						fontSize: 72,
						fontWeight: "bold",
						marginBottom: 24,
						lineHeight: 1,
						display: "block",
					}}>
					Resume Library
				</div>

				{/* Description */}
				<div
					style={{
						fontSize: 32,
						opacity: 0.95,
						marginBottom: 48,
						lineHeight: 1.3,
						textAlign: "center",
						display: "block",
					}}>
					Manage, organize, and share your professional resumes
				</div>

				{/* Features */}
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						gap: 48,
						marginBottom: 40,
						flexWrap: "wrap",
						justifyContent: "center",
					}}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							background: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							borderRadius: 20,
							padding: "24px 32px",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							minWidth: 180,
						}}>
						<div style={{ fontSize: 48, marginBottom: 8, display: "block" }}>📁</div>
						<div style={{ fontSize: 20, fontWeight: "600", display: "block" }}>Organize</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							background: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							borderRadius: 20,
							padding: "24px 32px",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							minWidth: 180,
						}}>
						<div style={{ fontSize: 48, marginBottom: 8, display: "block" }}>🔗</div>
						<div style={{ fontSize: 20, fontWeight: "600", display: "block" }}>Share</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							background: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							borderRadius: 20,
							padding: "24px 32px",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							minWidth: 180,
						}}>
						<div style={{ fontSize: 48, marginBottom: 8, display: "block" }}>📊</div>
						<div style={{ fontSize: 20, fontWeight: "600", display: "block" }}>Track</div>
					</div>
				</div>

				{/* Call to action */}
				<div
					style={{
						fontSize: 24,
						opacity: 0.9,
						fontWeight: "400",
						display: "block",
					}}>
					Your Professional Resume Collection
				</div>
			</div>

			{/* Footer */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					right: 60,
					fontSize: 18,
					opacity: 0.7,
					fontWeight: "500",
					display: "block",
				}}>
				airesumegen.com
			</div>
		</div>,
		{
			...size,
		}
	)
}
