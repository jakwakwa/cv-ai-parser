import { ImageResponse } from "next/og"

// Image metadata
export const alt = "CV AI Parser - Professional Resume Builder & AI Parser"
export const size = {
	width: 1200,
	height: 1200,
}
export const contentType = "image/png"

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)",
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
			}}>
			{/* Background decorative elements */}
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: 300,
					height: 300,
					background: "rgba(255, 255, 255, 0.1)",
					borderRadius: "50%",
					transform: "translate(100px, -100px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: 250,
					height: 250,
					background: "rgba(255, 255, 255, 0.08)",
					borderRadius: "50%",
					transform: "translate(-80px, 80px)",
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
					padding: "0 60px",
				}}>
				{/* Logo/Brand */}
				<div
					style={{
						fontSize: 72,
						fontWeight: "bold",
						marginBottom: 32,
						background: "linear-gradient(45deg, #ffffff, #e0e7ff)",
						backgroundClip: "text",
						color: "transparent",
						lineHeight: 1,
						textAlign: "center",
					}}>
					CV AI Parser
				</div>

				{/* Tagline */}
				<div
					style={{
						fontSize: 32,
						fontWeight: "500",
						marginBottom: 48,
						opacity: 0.95,
						lineHeight: 1.2,
						textAlign: "center",
					}}>
					Transform Your Resume with AI
				</div>

				{/* Features in a grid */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 24,
						marginBottom: 48,
						alignItems: "center",
					}}>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 32,
							justifyContent: "center",
						}}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								background: "rgba(255, 255, 255, 0.15)",
								backdropFilter: "blur(10px)",
								borderRadius: 16,
								padding: "20px 24px",
								border: "1px solid rgba(255, 255, 255, 0.2)",
								minWidth: 140,
							}}>
							<div style={{ fontSize: 36, marginBottom: 8 }}>🤖</div>
							<div style={{ fontSize: 16, fontWeight: "600" }}>AI Powered</div>
						</div>

						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								background: "rgba(255, 255, 255, 0.15)",
								backdropFilter: "blur(10px)",
								borderRadius: 16,
								padding: "20px 24px",
								border: "1px solid rgba(255, 255, 255, 0.2)",
								minWidth: 140,
							}}>
							<div style={{ fontSize: 36, marginBottom: 8 }}>🎨</div>
							<div style={{ fontSize: 16, fontWeight: "600" }}>Custom Colors</div>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							background: "rgba(255, 255, 255, 0.15)",
							backdropFilter: "blur(10px)",
							borderRadius: 16,
							padding: "20px 24px",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							minWidth: 140,
						}}>
						<div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
						<div style={{ fontSize: 16, fontWeight: "600" }}>PDF Export</div>
					</div>
				</div>

				{/* Call to action */}
				<div
					style={{
						fontSize: 20,
						opacity: 0.9,
						fontWeight: "400",
						textAlign: "center",
					}}>
					Upload • Parse • Customize • Share
				</div>
			</div>

			{/* Footer */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					fontSize: 16,
					opacity: 0.7,
					fontWeight: "500",
				}}>
				airesumegen.com
			</div>
		</div>,
		{
			...size,
		}
	)
}
