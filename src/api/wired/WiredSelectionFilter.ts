import { ColorConverter, NitroFilter } from '@nitrots/nitro-renderer';

const vertex = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;

const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 lineColor;
uniform vec3 color;
uniform float alpha;
uniform float lineAlpha;
void main(void) {
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    // Mix the overlay color with the current texture color, preserving original alpha
    vec3 colorLine = lineColor;
    vec3 colorOverlay = color;

    if(currentColor.r == 0.0 && currentColor.g == 0.0 && currentColor.b == 0.0 && currentColor.a > 0.0) {
        // For outlines, render the lineColor as-is but with configurable alpha multiplier so border can be more visible
        float outlineAlpha = clamp(lineAlpha, 0.0, 1.0);
        gl_FragColor = vec4(lineColor, currentColor.a * outlineAlpha);
    } else if(currentColor.a > 0.0) {
        // For the fill, blend the overlay with the underlying color so details remain visible
        vec3 mixed = mix(currentColor.rgb, colorOverlay, alpha);
        gl_FragColor = vec4(mixed, currentColor.a);
    }
}`;

export class WiredSelectionFilter extends NitroFilter
{
    private _lineColor: number;
    private _color: number;
    private _alpha: number;

    constructor(lineColor: number | number[], color: number | number[], alpha: number = 0.35, lineAlpha: number = 0.95)
    {
        super(vertex, fragment);

        this.uniforms.lineColor = new Float32Array(3);
        this.uniforms.color = new Float32Array(3);
        this.uniforms.alpha = alpha;
        this.uniforms.lineAlpha = lineAlpha;
        this.lineColor = lineColor;
        this.color = color;
        this._alpha = alpha;
        this._lineAlpha = lineAlpha;
    }

    public get lineColor(): number | number[]
    {
        return this._lineColor;
    }

    public set lineColor(value: number | number[])
    {
        const arr = this.uniforms.lineColor;

        if(typeof value === 'number')
        {
            ColorConverter.hex2rgb(value, arr);

            this._lineColor = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];

            this._lineColor = ColorConverter.rgb2hex(arr);
        }
    }

    public get color(): number | number[]
    {
        return this._color;
    }

    public set color(value: number | number[])
    {
        const arr = this.uniforms.color;

        if(typeof value === 'number')
        {
            ColorConverter.hex2rgb(value, arr);

            this._color = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];

            this._color = ColorConverter.rgb2hex(arr);
        }
    }

    public get alpha(): number
    {
        return this._alpha;
    }

    public set alpha(value: number)
    {
        if(value === undefined) return;

        this.uniforms.alpha = value;
        this._alpha = value;
    }

    public get lineAlpha(): number
    {
        return this._lineAlpha;
    }

    public set lineAlpha(value: number)
    {
        if(value === undefined) return;

        this.uniforms.lineAlpha = value;
        this._lineAlpha = value;
    }
}
