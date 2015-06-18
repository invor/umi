// OpenGL mesh prototype

function Mesh()
{
	this.vertex_buffer = gl.createBuffer();
	this.index_buffer = gl.createBuffer();
	this.numIndices = null;
	this.mesh_type = null;
}

Mesh.prototype.bufferDataFromArray = function(vertices, indices, mesh_type)
{
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertex_buffer);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.index_buffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices), gl.STATIC_DRAW);
	
	this.numIndices = indices.length;
	this.mesh_type = mesh_type;
}

Mesh.prototype.setVertexAttribPointer = function(index, size, type, normalized, stride, pointer)
{
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertex_buffer);
	gl.enableVertexAttribArray(index);
	gl.vertexAttribPointer(index,size,type,normalized,stride,pointer);
}

Mesh.prototype.draw = function()
{
	gl.bindBuffer(gl.ARRAY_BUFFER,this.vertex_buffer); // check for webgl best practises
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.index_buffer);
	gl.drawElements(this.mesh_type,this.numIndices,gl.UNSIGNED_INT, 0);
}

